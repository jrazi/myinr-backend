
const express = require('express');
const router = express.Router();

const models = require('../../../../../../models');
const ResponseTemplate = require("../../../../../ResponseTemplate");
const JalaliDate = require("../../../../../../util/JalaliDate");
const errors = require("../../../../../errors");
const SimpleValidators = require("../../../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../../../util");
const {QueryTypes} = require("sequelize");

router.get('', asyncFunctionWrapper(getAppointmentList));
router.post('', asyncFunctionWrapper(addAppointment));

router.put('/:appointmentId', asyncFunctionWrapper(updateAppointment));
router.get('/:appointmentId', asyncFunctionWrapper(getAppointment));



async function getAppointmentList(req, res, next) {
    const patientUserId = req.patientInfo.userId;

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: ['appointments'],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    let appointmentList = patient.appointments;

    appointmentList = appointmentList.map(appointment => appointment.getApiObject());

    const response =  ResponseTemplate.create()
        .withData({
            appointments: appointmentList,
        });

    res.json(response);

}

async function getAppointment(req, res, next) {
    const patientUserId = req.patientInfo.userId;
    const appointmentId = req.params.appointmentId;

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [{model: models.VisitAppointment, as: 'appointments', where: {id: appointmentId}}],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    if (patient.appointments.length === 0) {
        next(new errors.AppointmentNotFound());
        return;
    }

    const appointment = patient.appointments[0].getApiObject();
    const response =  ResponseTemplate.create()
        .withData({
            appointment,
        });

    res.json(response);
}

async function addAppointment(req, res, next) {
    const patientUserId = req.patientInfo.userId;

    const appointmentToAdd = req.body.appointment;

    if ((appointmentToAdd || null) == null) {
        next(new errors.IncompleteRequest("Appointment info was not provided."));
        return;
    }

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    await models.VisitAppointment.sequelize.transaction(async (tr) => {

        appointmentToAdd.patientUserId = patientUserId;
        const insertedAppointment = await models.VisitAppointment.create(appointmentToAdd, {transaction: tr});

        const response =  ResponseTemplate.create()
            .withData({
                appointment: insertedAppointment.getApiObject(),
            });

        res.json(response);
    });
}

async function updateAppointment(req, res, next) {
    const patientUserId = req.patientInfo.userId;
    const appointmentId = req.params.appointmentId;

    const updatedAppointment = req.body.appointment;

    if ((updatedAppointment || null) == null) {
        next(new errors.IncompleteRequest("Appointment info was not provided."));
        return;
    }

    let patient = await models.Patient.findOne({
        where: {userId: patientUserId, physicianUserId: req.principal.userId},
        include: [{model: models.VisitAppointment, as: 'appointments', where: {id: appointmentId}}],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    if (patient.appointments.length == 0) {
        next(new errors.AppointmentNotFound());
        return;
    }


    const appointment = patient.appointments[0];

    appointment.approximateVisitDate = updatedAppointment.approximateVisitDate;
    appointment.scheduledVisitDate = updatedAppointment.scheduledVisitDate;
    appointment.scheduledVisitTime = updatedAppointment.scheduledVisitTime;

    await appointment.save();

    const response =  ResponseTemplate.create()
        .withData({
            appointment: appointment.getApiObject(),
        });

    res.json(response);
}


module.exports = router;


