
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


    await models.Visit.sequelize.transaction(async (tr) => {
        attendedAppointment.hasVisitHappened = true;
        attendedAppointment.save({transaction: tr});

        const medicationHistory = visitToAdd.medicationHistory;
        if (SimpleValidators.hasValue(medicationHistory) && TypeChecker.isList(medicationHistory)) {
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

        if (TypeChecker.isList(visitToAdd.recommendedDosage) && visitToAdd.recommendedDosage.length === 7) {
            const validObjectCount = visitToAdd.recommendedDosage.reduce((acc, current) => Number((current||{}).dosagePH) > 0 ? acc + 1 : acc, 0);
            if (validObjectCount > 0) {
                visitToAdd.recommendedDosage.forEach(dosage => dosage.patientUserId = patientUserId);

                const insertedDosageRecords = await models.WarfarinDosageRecord.bulkCreate(visitToAdd.recommendedDosage, {
                    transaction: tr,
                    returning: true,
                });
            }
        }

        if (SimpleValidators.hasValue(visitToAdd.nextVisitDate || null)) {
            const jDate = JalaliDate.create(visitToAdd.nextVisitDate);
            if (jDate.isValidDate()) {
                const appointmentToAdd = {
                    patientUserId: patientUserId,
                    approximateVisitDate: jDate.toJson().jalali.asString,
                }
                const insertedAppointment = await models.VisitAppointment.create(appointmentToAdd, {transaction: tr});
            }
        }
        visitToAdd.patientUserId = patientUserId;
        visitToAdd.visitDate = JalaliDate.now().toJson().jalali.asString;
        visitToAdd.visitFlag = true;

        const insertedVisit = await models.Visit.create(visitToAdd, {transaction: tr});

        const response =  ResponseTemplate.create()
            .withData({
                visit: insertedVisit.getApiObject(),
            });

        res.json(response);
    });
}

module.exports = router;

