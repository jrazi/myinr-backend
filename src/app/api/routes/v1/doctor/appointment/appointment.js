
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
            }],
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

    let allAppointments = doctor.patients.reduce((accAppointments, currentPatient) => [...accAppointments, ...currentPatient.appointments], []);

    let today = JalaliDate.now();

    let filteredAppointments = allAppointments.filter(appointment => {
        if (!appointment.isScheduled || appointment.expired) return false;
        let appointmentDate = JalaliDate.create(appointment.scheduledVisitDate);
        return appointmentDate.isValidDate() && today.compareWithJalaliDate(appointmentDate) <= 0;
    });


    let appointmentList = (filteredAppointments || []).map(appointment => appointment.getApiObject());

    const response =  ResponseTemplate.create()
        .withData({
            appointments: appointmentList,
        });

    res.json(response);

}

module.exports = router;


