
const express = require('express');
const router = express.Router();

const models = require('../../../../../models');
const ResponseTemplate = require("../../../../ResponseTemplate");
const errors = require("../../../../errors");
const SimpleValidators = require("../../../../../util/SimpleValidators");
const JalaliDate = require("../../../../../util/JalaliDate");
const TypeChecker = require("../../../../../util/TypeChecker");
const JalaliTime = require("../../../../../util/JalaliTime");
const {asyncFunctionWrapper} = require("../../../util");

router.get('/outgoing', asyncFunctionWrapper(getOutgoingMessages));
router.get('/incoming', asyncFunctionWrapper(getIncomingMessages));

router.post('/outgoing', asyncFunctionWrapper(sendMessage));



async function getOutgoingMessages(req, res, next) {
    let messages = await models.PhysicianToPatientMessage.findAll({
        where: {
            physicianUserId: req.principal.userId
        },
    });
    messages = messages.map(message => message.getApiObject());

    const response =  ResponseTemplate.create()
        .withData({
            messages: messages,
        });

    res.json(response);

}

async function getIncomingMessages(req, res, next) {
    let messages = await models.PatientToPhysicianMessage.findAll({where: {patientUserId: req.principal.userId}});
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
    const patientUserId = req.query.patientUserId;

    if (!TypeChecker.isObject(messageToAdd)) {
        next(new errors.IncompleteRequest("Message info was not provided."));
        return;
    }
    if (!SimpleValidators.isNonEmptyString(patientUserId)) {
        next(new errors.QueryParameterMissing("Missing or invalid query parameter {patientUserId}"));
        return;
    }

    messageToAdd.patientUserId = patientUserId;
    messageToAdd.physicianUserId = req.principal.userId;
    messageToAdd.messageDate = JalaliDate.now().toJson().jalali.asString;
    messageToAdd.messageTime = JalaliTime.now().toJson().asObject;

    await models.Visit.sequelize.transaction(async (tr) => {

        if (SimpleValidators.hasValue(messageToAdd.nextVisitDate || null)) {
            const jDate = JalaliDate.create(messageToAdd.nextVisitDate);
            const dateAsString = jDate.toJson().jalali.asString;
            messageToAdd.visitDate = dateAsString;
            if (jDate.isValidDate()) {
                const appointmentToAdd = {
                    patientUserId: patientUserId,
                    approximateVisitDate: dateAsString,
                }
                var insertedAppointment = await models.VisitAppointment.create(appointmentToAdd, {transaction: tr});
            }
        }

        if (TypeChecker.isList(messageToAdd.prescription) && messageToAdd.prescription.length === 7) {
            const validObjectCount = messageToAdd.prescription.reduce((acc, current) => Number((current||{}).dosagePH) >= 0 ? acc + 1 : acc, 0);
            if (validObjectCount > 0) {
                messageToAdd.prescription.forEach(dosage => {
                    dosage.patientUserId = patientUserId;
                    dosage.dosagePA = null;
                    dosage.dosagePH = dosage.dosagePH || 0;
                });

                var insertedDosageRecords = await models.WarfarinDosageRecord.bulkCreate(messageToAdd.prescription, {
                    transaction: tr,
                    returning: true,
                });
            }
        }
        
        const insertedMessage = await models.PhysicianToPatientMessage.create(messageToAdd, {});

        const response = ResponseTemplate.create()
            .withData({
                message: insertedMessage.getApiObject(),
                appointment: insertedAppointment || null,
                prescription: insertedDosageRecords || null,
            })
            .toJson();

        res.json(response);

    })

}

module.exports = router;


