
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
router.get('/all', asyncFunctionWrapper(getAllMessages));
router.get('/outgoing', asyncFunctionWrapper(getOutgoingMessages));
router.get('/incoming', asyncFunctionWrapper(getIncomingMessages));

router.post('/outgoing', asyncFunctionWrapper(sendMessage));


async function getAllMessages(req, res, next) {
    const patientQuery = SimpleValidators.hasValue(req.query.patientUserId) ? {patientUserId: req.query.patientUserId} : {};
    const outgoing = (await models.PhysicianToPatientMessage
        .findAll({where: {physicianUserId: req.principal.userId, ...patientQuery}}))
        .map(message => message.getApiObject());

    const incoming = (await models.PatientToPhysicianMessage
        .findAll({where: {physicianUserId: req.principal.userId, ...patientQuery}}))
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
    const patientQuery = SimpleValidators.isNumber(req.query.patientUserId) ? {patientUserId: req.query.patientUserId} : {};
    let messages = await models.PhysicianToPatientMessage.findAll({
        where: {
            physicianUserId: req.principal.userId,
            ...patientQuery
        },
        include: [
            'patientInfo',
        ]
    });
    messages = messages.map(message => message.getApiObject());
    sortMessageListByDateDESC(messages);

    const response =  ResponseTemplate.create()
        .withData({
            messages: messages,
        });

    res.json(response);

}

async function getIncomingMessages(req, res, next) {
    const patientQuery = SimpleValidators.isNumber(req.query.patientUserId) ? {patientUserId: req.query.patientUserId} : {};
    let messages = await models.PatientToPhysicianMessage.findAll({
        where: {
            physicianUserId: req.principal.userId,
            ...patientQuery,
        },
        include: [
            'patientInfo',
        ]
    });
    sortMessageListByDateDESC(messages);
    messages = messages.map(message => message.getApiObject());

    if (req.query.onlyNew == 'true') {
        let outgoingMessages = await models.PhysicianToPatientMessage.findAll({
            where: {
                physicianUserId: req.principal.userId,
            },
        });
        sortMessageListByDateDESC(outgoingMessages);
        messages = filterNewIncomingMessages(messages, outgoingMessages);
    }

    else if (req.query.groupByNew == 'true') {
        let outgoingMessages = await models.PhysicianToPatientMessage.findAll({
            where: {
                physicianUserId: req.principal.userId,
            },
        });
        sortMessageListByDateDESC(outgoingMessages);
        messages = groupMessagesByNewOrPrevious(messages, outgoingMessages);
    }

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

        const insertedDosageRecords = await models.WarfarinDosageRecord.insertPrescriptionRecords(messageToAdd.prescription, patientUserId, new Date(), tr);

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

function sortMessageListByDateDESC(messages) {
    messages.sort((m1, m2) => compareTwoMessageDates(m2, m1))
}

function filterNewIncomingMessages(incoming, outgoing) {
    return incoming.filter((incomingMessage) => {
        const latestOutgoingForPatient = outgoing.find(item => item.patientUserId == incomingMessage.patientUserId) || null;
        if (latestOutgoingForPatient == null) return false;
        return compareTwoMessageDates(incomingMessage, latestOutgoingForPatient) > 0;
    })
}

function groupMessagesByNewOrPrevious(incoming, outgoing) {
    const groupedMessages  = {
        new: [],
        previous: [],
    }
    incoming.forEach((incomingMessage) => {
        const latestOutgoingForPatient = outgoing.find(item => item.patientUserId == incomingMessage.patientUserId) || null;
        const isNew = !latestOutgoingForPatient || (compareTwoMessageDates(incomingMessage, latestOutgoingForPatient) > 0);
        if (isNew)
            groupedMessages.new.push(incomingMessage);
        else groupedMessages.previous.push(incomingMessage);
    });
    return groupedMessages;
}


function compareTwoMessageDates(m1, m2) {
    const m1Date = JalaliDate.create(m1.messageDate);
    const m2Date = JalaliDate.create(m2.messageDate);
    const dateCmp = m1Date.compareWithJalaliDate(m2Date) || 0;

    const m1Time = JalaliTime.ofSerializedJalaliTime(m1.messageTime);
    const m2Time = JalaliTime.ofSerializedJalaliTime(m2.messageTime);
    const timeCmp = m1Time.compareWithJalaliTime(m2Time) || 0;

    return dateCmp !== 0 ? dateCmp : timeCmp;
}
module.exports = router;


