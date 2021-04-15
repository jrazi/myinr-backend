
var express = require('express');
var router = express.Router();
const {QueryTypes} = require("sequelize");
const {Op} = require("sequelize");

const models = require("../../../../../models");
const errors = require("../../../../errors");
const ResponseTemplate = require("../../../../ResponseTemplate");
const SequelizeUtil = require("../../../../../util/SequelizeUtil");
const TypeChecker = require("../../../../../util/TypeChecker");
const JalaliDate = require("../../../../../util/JalaliDate");
const ListUtil = require("../../../../../util/ListUtil");
const SimpleValidators = require("../../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../../util");
const {firstWithValue} = require("../../../../../util/DatabaseNormalizer");
const {hasValue} = require("../../../../../util/SimpleValidators");


router.get('', asyncFunctionWrapper(getFirstVisitInfo));

router.put('', asyncFunctionWrapper(updateFirstVisit));

router.put('/start', asyncFunctionWrapper(startFirstVisit));

router.put('/finish', asyncFunctionWrapper(finishFirstVisit));


async function getFirstVisitInfo(req, res, next) {
    const patientUserId = req.patientInfo.userId;
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
    firstVisit.warfarinInfo.firstTimeWarfarin = !hasValue(firstVisit.warfarinInfo.lastWarfarinDosage) && (firstWithValue(firstVisit.warfarinInfo.dateOfFirstWarfarin, "") == "");

    // firstVisit.recommendedDosage = SequelizeUtil.getMinOfList(patient.warfarinWeeklyDosages);

    firstVisit.recommendedDosage = models.WarfarinWeekDosage.build({}).get({plain: true});
    // firstVisit.recommendedDosage = patient.warfarinDosageRecords;

    const response = ResponseTemplate.create()
        .withData({
            firstVisit,
        })
        .toJson();

    res.json(response);
}

async function startFirstVisit(req, res, next) {
    const patientUserId = req.patientInfo.userId;
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
        await models.FirstVisit.sequelize.transaction(async (tr) => {
            const visitToAdd = {
                patientUserId: patientUserId,
                visitDate: JalaliDate.now().toJson().jalali.asString,

            };

            const insertedVisit = await models.FirstVisit.create(visitToAdd, {transaction: tr});

            const response = ResponseTemplate.create()
                .withData({
                    firstVisit: SequelizeUtil.filterFields(insertedVisit.get({plain: true}), firstVisitIncludedFields),
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
    const patientUserId = req.patientInfo.userId;
    const patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['firstVisit', 'appointments'],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    else if (patient.firstVisit == null) {
        next(new errors.FirstVisitNotFound());
        return;
    }

    else if (patient.firstVisit.flags.isEnded === true) {
        next(new errors.IllegalOperation("First visit is ended. You can no longer update it."));
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

    const upsertLastWarfarinDosageIfProvided = async (tr) => {
        const firstTimeWarfarin = (firstVisitUpdatedInfo['warfarinInfo'] || {})['firstTimeWarfarin'];
        let lastWarfarinDosageToUpdate = (firstVisitUpdatedInfo['warfarinInfo'] || {})['lastWarfarinDosage'];

        if (firstTimeWarfarin === true) {
            await models.WarfarinWeekDosage.destroy({
                where: {
                    patientUserId: patientUserId,
                },
                transaction: tr,
            });
            return;
        }
        else if (TypeChecker.isObject(lastWarfarinDosageToUpdate)) {
            lastWarfarinDosageToUpdate.patientUserId = patientUserId;

            const currentRecord = await models.WarfarinWeekDosage.findOne({
                where: {
                    patientUserId: patientUserId,
                },
                transaction: tr,
            });
            if (currentRecord == null) {
                const insertedRecord = await models.WarfarinWeekDosage.create(lastWarfarinDosageToUpdate,{
                        transaction: tr
                    });
                return insertedRecord;
            }
            else {
                const updatedRecord = await models.WarfarinWeekDosage.update(
                    lastWarfarinDosageToUpdate,
                    {
                        where: {
                            patientUserId: patientUserId,
                        },
                        transaction: tr
                    });
                return updatedRecord;

            }
        }
    }


    try {
        updateIfHasValue('dateOfDiagnosis');
        updateIfHasValue('warfarinInfo');
        updateIfHasValue('testResult');
        updateIfHasValue('medicalHistory');
        updateIfHasValue('physicalExam');
        updateIfHasValue('echocardiography');
        updateIfHasValue('inr');
        updateIfHasValue('habit');
        updateIfHasValue('electrocardiography');
        updateIfHasValue('reportComment');
        updateIfHasValue('bleedingOrClottingTypes');
        patient.firstVisit.visitDate = JalaliDate.now().toJson().jalali.asString;

        await models.FirstVisit.sequelize.transaction(async (tr) => {
            const savedFirstVisit = await patient.firstVisit.save({transaction: tr});

            const patientConditions = patient.medicalCondition.map(condition => condition.name);
            const updatedMedicalConditions = [...patient.firstVisit.warfarinInfo.reasonForWarfarin.conditions, ...patient.firstVisit.warfarinInfo.reasonForWarfarin.heartValveReplacementConditions];

            const firstVisitConditions = updatedMedicalConditions.map(condition => condition.name);

            if (!ListUtil.listsEqual(patientConditions, firstVisitConditions)) {
                patient.medicalCondition = updatedMedicalConditions;
                await patient.save({transaction: tr});
            }
            
            if (SimpleValidators.hasValue(firstVisitUpdatedInfo.nextVisitDate || "")) {
                const jDate = JalaliDate.create(firstVisitUpdatedInfo.nextVisitDate);
                if (jDate.isValidDate()) {
                    const appointmentToAdd = {
                        patientUserId: patientUserId,
                        approximateVisitDate: jDate.toJson().jalali.asObject,
                    }
                    const insertedAppointment = await models.VisitAppointment.create(appointmentToAdd, {transaction: tr});
                }
            }

            const hasBledScore = firstVisitUpdatedInfo.hasBledScore;
            const cha2ds2Score = firstVisitUpdatedInfo.cha2ds2Score;

            if (hasValue(hasBledScore) && Object.keys(hasBledScore).length > 0) {
                hasBledScore.patientUserId = patientUserId;
                const insertedHasBledScore = await models.HasBledStage.create(hasBledScore, {transaction: tr});
            }

            if (hasValue(cha2ds2Score) && Object.keys(cha2ds2Score).length > 0) {
                cha2ds2Score.patientUserId = patientUserId;
                const insertedCha2ds2Score = await models.Cha2ds2vascScore.create(cha2ds2Score, {transaction: tr});
            }

            const medicationHistory = firstVisitUpdatedInfo.medicationHistory;
            if (hasValue(medicationHistory) && TypeChecker.isList(medicationHistory)) {
                await models.PatientMedicationRecord.destroy({
                    where: {
                        patientUserId: patientUserId,
                    },
                    transaction: tr,
                });
                medicationHistory.forEach(record => record.patientUserId = patientUserId);

                const insertedMedicationHistory = await models.PatientMedicationRecord.bulkCreate(
                    medicationHistory,
                    {returning: true, transaction: tr}
                )
            }

            await upsertLastWarfarinDosageIfProvided(tr);


            const firstVisit = SequelizeUtil.filterFields(savedFirstVisit.get({plain: true}), firstVisitIncludedFields);
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
    const patientUserId = req.patientInfo.userId;
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
    patient.firstVisit.visitDate = JalaliDate.now().toJson().jalali.asString;

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
    'inr',
    'testResult',
    'medicalHistory',
    'physicalExam',
    'echocardiography',
    'electrocardiography',
    'bleedingOrClottingTypes',
    'drugHistory',
    'habit',
    'flags',
    'reportComment',
]

module.exports = router;