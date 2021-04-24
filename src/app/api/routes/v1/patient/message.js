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


router.get('/outgoing', asyncFunctionWrapper(getOutgoingMessages));
router.post('/outgoing', asyncFunctionWrapper(sendMessage));



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

    const insertedMessage = await models.PatientToPhysicianMessage.create(messageToAdd, {});

    const response = ResponseTemplate.create()
        .withData({
            message: insertedMessage.getApiObject(),
        })
        .toJson();

    res.json(response);

}


module.exports = router;
