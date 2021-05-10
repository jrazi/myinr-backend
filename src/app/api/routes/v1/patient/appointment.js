var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const TypeChecker = require("../../../../util/TypeChecker");
const JalaliDate = require("../../../../util/JalaliDate");
const JalaliTime = require("../../../../util/JalaliTime");
const {asyncFunctionWrapper} = require("../../util");


router.get('', asyncFunctionWrapper(getPatientAppointments));

function compareTwoAppointmentDates(a1, a2) {
    const a1Date = JalaliDate.create(a1.scheduledVisitDate);
    const a2Date = JalaliDate.create(a2.scheduledVisitDate);
    const dateCmp = a1Date.compareWithJalaliDate(a2Date) || 0;

    const a1Time = JalaliTime.ofSerializedJalaliTime(a1.scheduledVisitTime);
    const a2Time = JalaliTime.ofSerializedJalaliTime(a2.scheduledVisitTime);
    const timeCmp = a1Time.compareWithJalaliTime(a2Time) || 0;

    return dateCmp !== 0 ? dateCmp : timeCmp;
}

function sortAppointmentListByDateDESC(appointments) {
    appointments.sort((m1, m2) => compareTwoAppointmentDates(m2, m1))
}


async function getPatientAppointments(req, res, next) {
    let patient = await models.Patient.findOne({
        where: {userId: req.principal.userId},
        include: ['appointments'],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    let appointmentList = patient.appointments.filter(appointment => appointment.isScheduled);
    sortAppointmentListByDateDESC(appointmentList);
    appointmentList = appointmentList.map(appointment => appointment.getApiObject());

    const response =  ResponseTemplate.create()
        .withData({
            appointments: appointmentList,
        });

    res.json(response);
}

module.exports = router;
