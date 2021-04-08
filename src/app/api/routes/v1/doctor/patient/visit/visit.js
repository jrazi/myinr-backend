
var express = require('express');
const errors = require("../../../../../errors");
const models = require("../../../../../../models");
const ResponseTemplate = require("../../../../../ResponseTemplate");
const SimpleValidators = require("../../../../../../util/SimpleValidators");
const JalaliDate = require("../../../../../../util/JalaliDate");
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
        include: ['visits'],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    let visits = patient.visits.map(visit => visit.getApiObject());;

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
        include: [{model: models.Visit, as: 'visits', where: {id: visitId}}],
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
        include: [{model: models.VisitAppointment, as: 'appointments', where: {id: appointmentId}}],
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

        const maxId = await models.Visit.max('id', {transaction: tr});
        const id = maxId + 1;

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

