
var express = require('express');
const errors = require("../../../../../errors");
const models = require("../../../../../../models");
const ResponseTemplate = require("../../../../../ResponseTemplate");
const SimpleValidators = require("../../../../../../util/SimpleValidators");
const {hasValue} = SimpleValidators;
const JalaliDate = require("../../../../../../util/JalaliDate");
const TypeChecker = require("../../../../../../util/TypeChecker");
const {firstWithValue} = require("../../../../../../util/DatabaseNormalizer");
const {asyncFunctionWrapper} = require("../../../../util");
const {QueryTypes} = require("sequelize");

var router = express.Router();

router.get('', asyncFunctionWrapper(getAllVisits));
router.post('', asyncFunctionWrapper(addVisit));
router.get('/:visitId', asyncFunctionWrapper(getVisit));


async function getAllVisits(req, res, next) {
    const patientUserId = req.patientInfo.userId;

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['visits', 'medicationHistory'],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    let visits = patient.visits
        .map(visit => visit.getApiObject());

    visits.forEach(visit => visit.medicationHistory = patient.medicationHistory);

    const response =  ResponseTemplate.create()
        .withData({
            visits,
        });

    res.json(response);

}

async function getVisit(req, res, next) {
    const patientUserId = req.patientInfo.userId;
    const visitId = req.params.visitId;

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [{model: models.Visit, as: 'visits', where: {id: visitId}}, 'medicationHistory'],
    });

    if (patient == null) {
        next(new errors.VisitNotFound());
        return;
    }

    else if (patient.visits.length === 0) {
        next(new errors.VisitNotFound());
        return;
    }

    let visit = patient.visits[0].getApiObject();
    visit.medicationHistory = patient.medicationHistory;

    const response =  ResponseTemplate.create()
        .withData({
            visit,
        });

    res.json(response);
}

async function addVisit(req, res, next) {
    const patientUserId = req.patientInfo.userId;
    const appointmentId = req.query.appointmentId;
    const visitToAdd = req.body.visit;

    if ((visitToAdd || null) == null) {
        next(new errors.IncompleteRequest("Visit info was not provided."));
        return;
    }
    if (!SimpleValidators.hasValue(appointmentId)) {
        next(new errors.IncompleteRequest("Please provide appointmentId as a query string ."));
        return;
    }

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [{model: models.VisitAppointment, as: 'appointments', where: {id: appointmentId}}, 'medicationHistory'],
    });

    if (patient == null) {
        next(new errors.AppointmentNotFound());
        return;
    }

    const attendedAppointment = patient.appointments[0];

    if (attendedAppointment.hasVisitHappened) {
        next(new errors.AlreadyExistsException("This appointment was attended before."));
        return;
    }

    const insertMedicationRecordsIfProvided = async (key, modelToUpdate, tableName, tr) => {
        const recordsToUpdate = visitToAdd[key];
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

    const insertDosageRecords = async (records, tr) => {
        for (let recordToInsert of records) {
            const maxId = await models.WarfarinDosageRecord.max('id', {transaction: tr});
            const id = maxId + 1;

            recordToInsert.patientUserId = patientUserId;
            recordToInsert.id = id;

            const record = models.WarfarinDosageRecord.build(recordToInsert);
            const insertResult = await models.WarfarinDosageRecord.sequelize.query(
                `INSERT INTO [myinrir_test].[DosageTbl] ([IDDosage],[IDUserPatient]) VALUES (${id}, ${patientUserId})`,
                {
                    type: QueryTypes.INSERT,
                    transaction: tr,
                }
            );

            const updateResult = await models.WarfarinDosageRecord.update(record.get({plain: true}), {where: {id: id, patientUserId: patientUserId}, transaction: tr});
        }
    }
    await models.Visit.sequelize.transaction(async (tr) => {
        attendedAppointment.hasVisitHappened = true;
        attendedAppointment.save({transaction: tr});

        const maxId = await models.Visit.max('id', {transaction: tr});
        const id = maxId + 1;

        const medicationHistory = visitToAdd.medicationHistory;
        if (SimpleValidators.hasValue(medicationHistory) && TypeChecker.isList(medicationHistory)) {
            await models.PatientMedicationRecord.destroy({
                where: {
                    patientUserId: patientUserId,
                },
                transaction: tr,
            });
            await insertMedicationRecordsIfProvided('medicationHistory', models.PatientMedicationRecord, 'PaDrTbl', tr);
        }

        if (TypeChecker.isList(visitToAdd.recommendedDosage) && visitToAdd.recommendedDosage.length === 7) {
            const validObjectCount = visitToAdd.recommendedDosage.reduce((acc, current) => Number((current||{}).dosagePH) > 0 ? acc + 1 : acc, 0);
            if (validObjectCount > 0) {
                await insertDosageRecords(visitToAdd.recommendedDosage);
            }
        }

        if (SimpleValidators.hasValue(visitToAdd.nextVisitDate || "")) {
            const jDate = JalaliDate.create(visitToAdd.nextVisitDate);
            if (jDate.isValidDate()) {
                const appointmentMaxId = await models.VisitAppointment.max('id', {transaction: tr});
                const appointmentId = appointmentMaxId + 1;
                const approximateVisitDate = jDate.toJson().jalali.asObject;

                const insertResult = await models.VisitAppointment.sequelize.query(
                    `INSERT INTO [myinrir_test].[AppointmentTbl] ([IDVisit],[UserIDPatient],[AYearVisit],[AMonthVisit],[ADayVisit]) VALUES (${appointmentId}, ${patientUserId}, ${approximateVisitDate.year}, ${approximateVisitDate.month}, ${approximateVisitDate.day})`,
                    {type: QueryTypes.INSERT, transaction: tr}
                );

                const appointmentToAdd = {
                    id: appointmentId,
                    patientUserId: patientUserId,
                    approximateVisitDate: jDate.toJson().jalali.asObject,
                }

                const record = models.VisitAppointment.build(appointmentToAdd);
                const updateResult = await models.VisitAppointment.update(record.get({plain: true}), {where: {id: appointmentId, patientUserId: patientUserId}, transaction: tr});
            }
        }

        const insertResult = await models.Visit.sequelize.query(
            `INSERT INTO [myinrir_test].[SecondTbl] ([IDSecond],[UserIDPatient]) VALUES (${id}, ${patientUserId})`,
            {type: QueryTypes.INSERT, transaction: tr}
        );

        visitToAdd.patientUserId = patientUserId;
        visitToAdd.id = id;
        visitToAdd.visitDate = JalaliDate.now().toJson().jalali.asString;
        visitToAdd.visitFlag = true;

        const record = models.Visit.build(visitToAdd);
        const temp = record.get({plain: true});

        const updateResult = await models.Visit.update(record.get({plain: true}), {where: {id: id, patientUserId: patientUserId}, transaction: tr});

        const response =  ResponseTemplate.create()
            .withData({
                visit: record.getApiObject(),
            });

        res.json(response);
    });
}

module.exports = router;

