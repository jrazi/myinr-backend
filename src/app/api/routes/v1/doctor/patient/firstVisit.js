
var express = require('express');
var router = express.Router();
const {QueryTypes} = require("sequelize");

const models = require("../../../../../models");
const errors = require("../../../../errors");
const ResponseTemplate = require("../../../../ResponseTemplate");
const SequelizeUtil = require("../../../../../util/SequelizeUtil");
const TypeChecker = require("../../../../../util/TypeChecker");
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

    firstVisit.recommendedDosage = SequelizeUtil.getMinOfList(patient.warfarinWeeklyDosages);

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

    const insertToSecondaryTableIfValueProvided = async (recordToUpdate, modelToUpdate, tableName, tr) => {
        if (hasValue(recordToUpdate) && Object.keys(recordToUpdate).length > 0) {
            const maxId = await modelToUpdate.max('id', {transaction: tr});
            const id = maxId + 1;
            const insertResult = await modelToUpdate.sequelize.query(
                `INSERT INTO [myinrir_test].[${tableName}] ([ID],[PatientID]) VALUES (${id}, ${patientUserId})`,
                {type: QueryTypes.INSERT, transaction: tr}
            );

            recordToUpdate.patientUserId = patientUserId;
            recordToUpdate.id = id;

            const record = modelToUpdate.build(recordToUpdate);
            const updateResult = await modelToUpdate.update(record.get({plain: true}), {where: {id: id, patientUserId: patientUserId}, transaction: tr});
            return updateResult;
        }
    }

    const insertMedicationRecordsIfProvided = async (key, modelToUpdate, tableName, tr) => {
        const recordsToUpdate = firstVisitUpdatedInfo[key];
        if (hasValue(recordsToUpdate) && TypeChecker.isList(recordsToUpdate)) {
            for (let recordToUpdate of recordsToUpdate) {
                const maxId = await modelToUpdate.max('id', {transaction: tr});
                const id = maxId + 1;

                recordToUpdate.patientUserId = patientUserId;
                recordToUpdate.id = id;

                const record = modelToUpdate.build(recordToUpdate);
                const insertResult = await modelToUpdate.sequelize.query(
                    `INSERT INTO [myinrir_test].[${tableName}] ([ID],[IDPatient],[Drug],[Dateofstart],[Dateofend]) VALUES (${id}, ${patientUserId}, '${firstWithValue(record.drugName, '')}', '${firstWithValue(record.startDate, '')}', '${firstWithValue(record.endDate, '')}')`,
                    {
                        type: QueryTypes.INSERT,
                        transaction: tr,
                    }
                );
            }
        }
    }

    const upsertLastWarfarinDosageIfProvided = async (tr) => {
        const firstTimeWarfarin = (firstVisitUpdatedInfo['warfarinInfo'] || {})['firstTimeWarfarin'];
        let lastWarfarinDosageToUpdate = (firstVisitUpdatedInfo['warfarinInfo'] || {})['lastWarfarinDosage'];

        const destroy = async () => {
            await models.WarfarinWeekDosage.destroy({
                where: {
                    patientUserId: patientUserId,
                },
                transaction: tr,
            });
        }

        const lastWarfarin = await models.WarfarinWeekDosage.findOne({
            where: {
                patientUserId: patientUserId,
            },
            transaction: tr,
        });

        if (firstTimeWarfarin === true && lastWarfarin != null) {
            await destroy();
            return;
        }
        else if (firstTimeWarfarin !== true && hasValue(lastWarfarinDosageToUpdate) && TypeChecker.isObject(lastWarfarinDosageToUpdate)) {
            lastWarfarinDosageToUpdate = models.WarfarinWeekDosage.build(lastWarfarinDosageToUpdate);
            lastWarfarinDosageToUpdate.patientUserId = patientUserId;
            if (lastWarfarin != null) {
                lastWarfarinDosageToUpdate.id = lastWarfarin.id;
                const updateResult = await models.WarfarinWeekDosage.update(lastWarfarinDosageToUpdate.get({plain: true}), {where: {id: lastWarfarin.id, patientUserId: patientUserId}, transaction: tr});
                return;
            }
            else {
                const maxId = await models.WarfarinWeekDosage.max('id', {transaction: tr});
                const id = maxId + 1;
                const insertResult = await models.WarfarinWeekDosage.sequelize.query(
                    `INSERT INTO [myinrir_test].[FirstDosageTbl] ([IDDosage],[IDUserPatient]) VALUES (${id}, ${patientUserId})`,
                    {type: QueryTypes.INSERT, transaction: tr}
                );
                lastWarfarinDosageToUpdate.id = id;
                const updateResult = await models.WarfarinWeekDosage.update(lastWarfarinDosageToUpdate.get({plain: true}), {where: {id: id, patientUserId: patientUserId}, transaction: tr});
                return;
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
        updateIfHasValue('visitDate');


        await models.FirstVisit.sequelize.transaction(async (tr) => {
            const result = await patient.firstVisit.save({transaction: tr});
            await insertToSecondaryTableIfValueProvided((firstVisitUpdatedInfo.hasBledScore || {}).data, models.HasBledStage, 'HAS-BLEDTbl', tr);
            await insertToSecondaryTableIfValueProvided((firstVisitUpdatedInfo.cha2ds2Score || {}).data, models.Cha2ds2vascScore, 'CHADS-VAScTbl', tr);

            const medicationHistory = firstVisitUpdatedInfo['medicationHistory'];
            if (hasValue(medicationHistory) && TypeChecker.isList(medicationHistory)) {
                await models.PatientMedicationRecord.destroy({
                    where: {
                        patientUserId: patientUserId,
                    },
                    transaction: tr,
                });
                await insertMedicationRecordsIfProvided('medicationHistory', models.PatientMedicationRecord, 'PaDrTbl', tr);
            }
            await upsertLastWarfarinDosageIfProvided(tr);

            // include: ['firstVisit', 'hasBledScore', 'cha2ds2Score', 'warfarinWeeklyDosages', 'medicationHistory',],

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