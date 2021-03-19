
var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

router.get('', getAllPatients);

router.get('/:userId', getPatient);

router.get('/:userId/firstVisit', getFirstVisitInfo);

router.put('/:userId/firstVisit', updateFirstVisit);

router.put('/:userId/firstVisit/start', startFirstVisit);

router.put('/:userId/firstVisit/finish', finishFirstVisit);

async function getAllPatients(req, res, next) {
    const doctor = await models.Physician.findOne({
        where: {
            userId: req.principal.userId
        },
        include: {
            model: models.Patient,
            as: 'patients',
            include: 'firstVisit',
        },
    });
    if (doctor == null) {
        next(new errors.PhysicianNotFound());
        return;
    }

    let patientsList = doctor.patients;

    patientsList = patientsList.map(patient => {
        patient.firstVisitStatus = patient.firstVisit;
        const patientData =  SequelizeUtil.excludeFields(patient.get({plain: true}), ['firstVisit']);
        return patientData;
    })

    const response = ResponseTemplate.create()
        .withData({
            patients: patientsList,
        })
        .toJson();

    res.json(response);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await models.Patient.findOne({
        where: {
            userId: patientUserId,
            physicianUserId: req.principal.userId
        },
        include: 'firstVisit',
    });
    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    patient.firstVisitStatus = patient.firstVisit;

    const patientData = SequelizeUtil.excludeFields(patient.get({plain: true}), ['firstVisit']);

    const response = ResponseTemplate.create()
        .withData({
            patient: patientData,
        })
        .toJson();

    res.json(response);
}

async function getFirstVisitInfo(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['firstVisit', 'hasBledScore', 'cha2ds2Score', 'warfarinWeeklyDosages', 'medicationHistory',],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    else if (patient.firstVisit == null) {
        next(new errors.FirstVisitNotFound());
        return;
    }

    const firstVisit = SequelizeUtil.filterFields(patient.firstVisit.get({plain: true}), firstVisitIncludedFields);
    firstVisit.medicationHistory = patient.medicationHistory;
    firstVisit.hasBledScore = SequelizeUtil.getMaxOfList(patient.hasBledScore);
    firstVisit.cha2ds2Score = SequelizeUtil.getMaxOfList(patient.cha2ds2Score);
    firstVisit.warfarinInfo.lastWarfarinDosage = SequelizeUtil.getMaxOfList(patient.warfarinWeeklyDosages);
    // firstVisit.recommendedDosage = patient.warfarinDosageRecords;

    const response = ResponseTemplate.create()
        .withData({
            firstVisit,
        })
        .toJson();

    res.json(response);
}

async function startFirstVisit(req, res, next) {

}

async function updateFirstVisit(req, res, next) {
    next();
}

async function finishFirstVisit(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['firstVisit', ],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    else if (patient.firstVisit == null) {
        next(new errors.FirstVisitNotFound());
        return;
    }

    else if (!patient.firstVisit.started) {
        next(new errors.IllegalOperation("First visit is not started yet."));
        return;
    }

    else if (patient.firstVisit.flags.isEnded) {
        next(new errors.IllegalOperation("First visit is already finished."));
        return;
    }

    patient.firstVisit.flags = {
        isSaved: patient.firstVisit.flags.isSaved,
        visitFlag: patient.firstVisit.flags.visitFlag,
        isEnded: true,
    }

    const firstVisit = await models.FirstVisit.save(patient.firstVisit);

    const response = ResponseTemplate.create()
        .withData({
        })
        .withMessage("First visit status changed to 'finished'")
        .toJson();

    res.json(response);

}

const firstVisitIncludedFields = [
    'id',
    'patientUserId',
    'visitDate',
    'dateOfDiagnosis',
    'warfarinInfo',
    'lastInrTest',
    'testResult',
    'medicalHistory',
    'physicalExam',
    'echocardiography',
    'ECG',
    'bleedingOrClottingTypes',
    'drugHistory',
    'habit',
    'flags',
    'inr',
    'reportComment',
]

module.exports = router;