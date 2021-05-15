const express = require('express');
const router = express.Router();

const models = require('../../../../../models');
const ResponseTemplate = require("../../../../ResponseTemplate");
const errors = require("../../../../errors");
const SimpleValidators = require("../../../../../util/SimpleValidators");
const JalaliDate = require("../../../../../util/JalaliDate");
const {asyncFunctionWrapper} = require("../../../util");

router.get('', asyncFunctionWrapper(getPatientMedicalInfo));


async function getPatientMedicalInfo(req, res, next) {
    const patientUserId = req.patientInfo.userId;

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [
            'firstVisit',
        ],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    const lastVisitPromise = models.Visit.getLastVisitOfPatient(patientUserId);
    const lastWarfarinDosagePromise = models.WarfarinDosageRecord.getLast7DosageRecordsForPatient(patientUserId);
    const lastMessagePromise = models.PatientToPhysicianMessage.getLastMessageFromPatient(patientUserId, req.principal.userId);

    let [lastVisit, lastWarfarinDosage, lastMessage] = await Promise.all([lastVisitPromise, lastWarfarinDosagePromise, lastMessagePromise]);

    const objectInMessageFormat = lastMessage || models.PatientToPhysicianMessage.build({patientUserId: patientUserId, physicianUserId: req.principal.userId});

    const hasMessage = SimpleValidators.hasValue(lastMessage);
    const hasVisit = SimpleValidators.hasValue(lastVisit);
    const hasFirstVisit = SimpleValidators.hasValue(patient.firstVisit);

    if (!SimpleValidators.isNonEmptyString(objectInMessageFormat.inrTargetRange.from)  && !SimpleValidators.isNonEmptyString(objectInMessageFormat.inrTargetRange.to)) {
        if (hasFirstVisit) {
            objectInMessageFormat.inrTargetRange = patient.firstVisit.inrTargetRange;
        }
    }
    if (hasFirstVisit) {
        objectInMessageFormat.bloodPressure = patient.firstVisit.bloodPressure;
        objectInMessageFormat.heartBeat = patient.firstVisit.heartBeat;
    }

    const medicalInfo = {
        medicalCondition: patient.medicalCondition,
        bloodPressure: objectInMessageFormat.bloodPressure,
        heartBeat: objectInMessageFormat.heartBeat,
        inr: objectInMessageFormat.inr,
        lastWarfarinDosage: lastWarfarinDosage,
        lastVisitDate: hasVisit ? lastVisit.visitDate : JalaliDate.create(null).toJson(),
        patientInfo: patient.get({plain: true}),
    }

    const response = ResponseTemplate.create()
        .withData({
            medicalInfo,
        })
        .toJson();

    res.json(response);
}

module.exports = router;