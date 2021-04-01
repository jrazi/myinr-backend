
const express = require('express');
const router = express.Router();

const models = require('../../../../../../models');
const ResponseTemplate = require("../../../../../ResponseTemplate");
const JalaliDate = require("../../../../../../util/JalaliDate");
const errors = require("../../../../../errors");
const {asyncFunctionWrapper} = require("../../../../util");

router.get('/:appointmentId', asyncFunctionWrapper(getAppointment));
router.get('/:appointmentId/:visitId', asyncFunctionWrapper(getVisit));

router.get('', asyncFunctionWrapper(getAppointmentList));

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

async function getVisit(req, res, next) {

}


module.exports = router;


