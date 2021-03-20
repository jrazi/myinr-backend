
var express = require('express');
var router = express.Router();
const {QueryTypes} = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const {hasValue} = require("../../../../util/SimpleValidators");

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
    const patientUserId = req.params.userId;
    const patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['firstVisit', ],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    else if (patient.firstVisit != null) {
        next(new errors.AlreadyExistsException("First visit is already started."));
        return;
    }


    try {
        const result = await models.FirstVisit.sequelize.transaction(async (tr) => {
            const maxId = await models.FirstVisit.max('id', {transaction: tr});
            const id = maxId + 1;
            const insertResult = await models.FirstVisit.sequelize.query(
                `INSERT INTO [myinrir_test].[FirstTbl] ([IDFirst],[IDUserPatient]) VALUES (${id}, ${patientUserId})`,
                {type: QueryTypes.INSERT, transaction: tr}
            );

            const firstVisit = models.FirstVisit.build({});

            const updateResult = await models.FirstVisit.update(firstVisit.get({plain: true}), {where: {id:  id}, transaction: tr});

            const firstVisitData = firstVisit.get({plain: true});
            firstVisitData.id = id;
            firstVisitData.patientUserId = patient.userId;

            const response = ResponseTemplate.create()
                .withData({
                    firstVisit: firstVisit,
                })
                .withMessage("First visit started")
                .toJson();

            res.json(response);
        })
    } catch(err) {
        console.log(err);
        next(new Error());
    }

}

async function updateFirstVisit(req, res, next) {
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

    const firstVisitUpdatedInfo = req.body.firstVisit;

    if (!hasValue(firstVisitUpdatedInfo)) {
        next(new errors.IncompleteRequest("First visit info is not provided."));
        return;
    }

    const updateIfHasValue = (key) => {
        if (!hasValue(firstVisitUpdatedInfo[key]))
            return;
        patient.firstVisit[key] = firstVisitUpdatedInfo[key];
    }

    try {
        updateIfHasValue('dateOfDiagnosis');
        updateIfHasValue('warfarinInfo');
        updateIfHasValue('lastInrTest');
        updateIfHasValue('testResult');
        updateIfHasValue('medicalHistory');
        updateIfHasValue('physicalExam');
        updateIfHasValue('echocardiography');
        updateIfHasValue('inr');
        updateIfHasValue('habit');
        updateIfHasValue('electrocardiography');
        updateIfHasValue('reportComment');
        updateIfHasValue('bleedingOrClottingTypes');

        await models.FirstVisit.sequelize.transaction(async (tr) => {
            const result = await patient.firstVisit.save({transaction: tr});
            const firstVisit = SequelizeUtil.filterFields(result.get({plain: true}), firstVisitIncludedFields);
            const response = ResponseTemplate.create()
                .withData({
                    firstVisit,
                })
                .withMessage("First visit updated with success")
                .toJson();

            res.json(response);
        })

    } catch(err) {
        console.log(err);
        next(err);
    }

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

    else if (patient.firstVisit.flags.isEnded) {
        next(new errors.IllegalOperation("First visit is already finished."));
        return;
    }

    patient.firstVisit.flags = {
        isEnded: true,
    }

    await patient.firstVisit.save();

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
    'electrocardiography',
    'bleedingOrClottingTypes',
    'drugHistory',
    'habit',
    'flags',
    'inr',
    'reportComment',
]

module.exports = router;