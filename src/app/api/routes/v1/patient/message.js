var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const TypeChecker = require("../../../../util/TypeChecker");
const JalaliDate = require("../../../../util/JalaliDate");
const JalaliTime = require("../../../../util/JalaliTime");
const {asyncFunctionWrapper} = require("../../util");


router.get('/all', asyncFunctionWrapper(getAllMessages));
router.get('/outgoing', asyncFunctionWrapper(getOutgoingMessages));
router.get('/incoming', asyncFunctionWrapper(getIncomingMessages));

router.post('/outgoing', asyncFunctionWrapper(sendMessage));


async function getAllMessages(req, res, next) {
    const outgoing = (await models.PatientToPhysicianMessage
        .findAll({where: {patientUserId: req.principal.userId}}))
        .map(message => message.getApiObject());

    const incoming = (await models.PhysicianToPatientMessage
        .findAll({where: {patientUserId: req.principal.userId}}))
        .map(message => message.getApiObject());


    const response = ResponseTemplate.create()
        .withData({
            outgoing,
            incoming
        })
        .toJson();

    res.json(response);
}

async function getOutgoingMessages(req, res, next) {
    let messages = await models.PatientToPhysicianMessage.findAll({where: {patientUserId: req.principal.userId}});
    messages = messages.map(message => message.getApiObject());

    const response = ResponseTemplate.create()
        .withData({
            messages: messages,
        })
        .toJson();

    res.json(response);
}

async function getIncomingMessages(req, res, next) {
    let messages = await models.PhysicianToPatientMessage.findAll({where: {patientUserId: req.principal.userId}});
    messages = messages.map(message => message.getApiObject());

    const response = ResponseTemplate.create()
        .withData({
            messages: messages,
        })
        .toJson();

    res.json(response);
}

async function sendMessage(req, res, next) {
    const messageToAdd = req.body.message;

    if (!TypeChecker.isObject(messageToAdd)) {
        next(new errors.IncompleteRequest("Message info was not provided."));
        return;
    }

    const patient = await models.Patient.findOne({where: {userId: req.principal.userId}, include: []});
    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }


    messageToAdd.patientUserId = req.principal.userId;
    messageToAdd.physicianUserId = patient.physicianUserId;
    messageToAdd.messageDate = JalaliDate.now().toJson().jalali.asString;
    messageToAdd.messageTime = JalaliTime.now().toJson().asObject;

    await models.Visit.sequelize.transaction(async (tr) => {
        const insertedMessage = await models.PatientToPhysicianMessage.create(messageToAdd, {transaction: tr});

        if (TypeChecker.isList(messageToAdd.latestWarfarinDosage) && messageToAdd.latestWarfarinDosage.length === 7) {
            const validObjectCount = messageToAdd.latestWarfarinDosage.reduce((acc, current) => Number((current||{}).dosagePA) >= 0 ? acc + 1 : acc, 0);
            if (validObjectCount > 0) {
                var last7DosageRecords = await models.WarfarinDosageRecord.scope({method: ['lastRecordsOfPatient', req.principal.userId]}).findAll();
                models.WarfarinDosageRecord.sortByDateASC(last7DosageRecords);

                if ((last7DosageRecords || []).length == 7) {
                    for (let i = 0; i < last7DosageRecords.length; i++) {
                        const record = last7DosageRecords[i];
                        record.dosagePA = messageToAdd.latestWarfarinDosage[i].dosagePA;
                        last7DosageRecords[i] = await record.save({transaction: tr});
                    }
                }
                else {
                    messageToAdd.latestWarfarinDosage.forEach(record => {
                        record.patientUserId = req.principal.userId;
                        record.dosagePH = null;
                    })
                    models.WarfarinDosageRecord.assignOneWeekDosageDates(messageToAdd.latestWarfarinDosage, new Date());
                    last7DosageRecords = await models.WarfarinDosageRecord.bulkCreate(messageToAdd.latestWarfarinDosage, {
                        transaction: tr,
                        returning: true,
                    });
                }

            }
        }
        const response = ResponseTemplate.create()
            .withData({
                message: insertedMessage.getApiObject(),
                latestWarfarinDosage: last7DosageRecords || null,
            })
            .toJson();

        res.json(response);

    });

}


module.exports = router;
