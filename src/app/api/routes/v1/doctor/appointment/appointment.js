
const express = require('express');
const router = express.Router();

const models = require('../../../../../models');
const ResponseTemplate = require("../../../../ResponseTemplate");
const errors = require("../../../../errors");
const SimpleValidators = require("../../../../../util/SimpleValidators");
const JalaliDate = require("../../../../../util/JalaliDate");
const {asyncFunctionWrapper} = require("../../../util");
const {QueryTypes} = require("sequelize");

router.get('', asyncFunctionWrapper(getUnattendedAppointments));



async function getUnattendedAppointments(req, res, next) {
    const doctor = await models.Physician.findOne({
        where: {
            userId: req.principal.userId
        },
        include: {
            model: models.Patient,
            as: 'patients',
            include: [{
                model: models.VisitAppointment,
                as: 'appointments',
                where: {hasVisitHappened: false}
            }, 'medicationHistory'],
        },
    });

    if (doctor == null || doctor.patients == null) { // TODO change this
        const response =  ResponseTemplate.create()
            .withData({
                appointments: [],
            });
        res.json(response);
        return;
    }

    doctor.patients.forEach(patient => {
        const patientInfo = patient.get({plain: true});
        delete patientInfo.appointments;
        patient.appointments.forEach(appointment => {
            appointment.patientInfo = patientInfo;
        })
    })
    let allAppointments = doctor.patients.reduce((accAppointments, currentPatient) => [...accAppointments, ...currentPatient.appointments], []);


    let filteredAppointments = allAppointments.filter(appointment => {
        return appointment.isScheduled && !appointment.expired;
    });


    let appointmentList = (filteredAppointments || []).map(appointment => {
        const obj = appointment.getApiObject();
        obj.patient = appointment.patientInfo;
        return obj;
    });

    const response =  ResponseTemplate.create()
        .withData({
            appointments: appointmentList,
        });

    res.json(response);

}

module.exports = router;


