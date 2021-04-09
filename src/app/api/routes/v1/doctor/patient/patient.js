
var express = require('express');
var router = express.Router();

const firstVisitRoute = require('./firstVisit');
const appointmentRouter = require('./appointment/patient_appointment');
const visitRouter = require('./visit/visit');

const models = require("../../../../../models");
const errors = require("../../../../errors");
const ResponseTemplate = require("../../../../ResponseTemplate");
const SequelizeUtil = require("../../../../../util/SequelizeUtil");
const {asyncFunctionWrapper} = require("../../../util");

router.get('', asyncFunctionWrapper(getAllPatients));

router.use('/:userId', (req, res, next) => {
    req.patientInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getPatient));
router.use('/:userId/firstVisit', firstVisitRoute);
router.use('/:userId/appointment', appointmentRouter);

router.use('/:userId/appointment', appointmentRouter);
router.use('/:userId/visit', visitRouter);


async function getAllPatients(req, res, next) {
    const doctor = await models.Physician.findOne({
        where: {
            userId: req.principal.userId
        },
        include: {
            model: models.Patient,
            as: 'patients',
            include: ['firstVisit'],
        },
    });
    if (doctor == null) {
        next(new errors.PhysicianNotFound());
        return;
    }

    let patientsList = doctor.patients;

    patientsList = patientsList.map(patient => {
        patient.firstVisitStatus = patient.firstVisit;
        const patientData =  SequelizeUtil.excludeFields(patient.get({plain: true}), ['firstVisit']);
        return patientData;
    })

    const response = ResponseTemplate.create()
        .withData({
            patients: patientsList,
        })
        .toJson();

    res.json(response);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;
    const {includeFirstVisit, includeAppointments, includeVisits} = req.query;

    let include = ['firstVisit'];
    if (includeAppointments)
        include.push('appointments');
    if (includeVisits)
        include.push('visits');

    const patient = await models.Patient.findOne({
        where: {
            userId: patientUserId,
            physicianUserId: req.principal.userId
        },
        include: include,
    });
    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    patient.firstVisitStatus = patient.firstVisit;

    const excludedFields = includeFirstVisit ? [] : ['firstVisit'];

    const patientData = SequelizeUtil.excludeFields(patient.get({plain: true}), excludedFields);

    const response = ResponseTemplate.create()
        .withData({
            patient: patientData,
        })
        .toJson();

    res.json(response);
}


module.exports = router;