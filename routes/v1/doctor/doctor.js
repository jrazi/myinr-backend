
var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const Physician = require("../../../models").Physician
const User = require("../../../models").User
const Patient = require("../../../models").Patient
const models = require("../../../models");
const errors = require("../../../api/errors");
const ResponseTemplate = require("../../../api/ResponseTemplate");


router.use(authorizationFilter);

router.get('/me', getDoctorInfo);

router.get('/patient', getAllPatients);

router.get('/patient/:userId', getPatient);

router.get('/patient/:userId/firstVisit', getFirstVisitInfo);

router.put('/patient/:userId/firstVisit', updateFirstVisit);

router.put('/patient/:userId/firstVisit/finish', finishFirstVisit);

function authorizationFilter(req, res, next) {
    req.principal = {
        userId: 4129,
    }
    next();
}



async function getDoctorInfo(req, res, next) {
    const doctor = await Physician.findOne({where: {userId: req.principal.userId}, include: 'userInfo'});
    if (doctor == null) {
        next(new errors.PhysicianNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            doctor: doctor,
        })
        .toJson();

    res.json(response);
}


async function getAllPatients(req, res, next) {
    const doctor = await Physician.findOne({where: {userId: req.principal.userId}, include: {model: Patient, as: 'patients'},});
    if (doctor == null) {
        next(new errors.PhysicianNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            patients: doctor.patients,
        })
        .toJson();

    res.json(response);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await Patient.findOne({where: {userId: patientUserId, physicianUserId: req.principal.userId},});
    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            patient: patient,
        })
        .toJson();

    res.json(response);
}

async function getFirstVisitInfo(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await Patient.findOne({where: {userId: patientUserId, physicianUserId: req.principal.userId}, include: 'firstVisit'});

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    else if (patient.firstVisit == null) {
        next(new errors.FirstVisitNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            firstVisit: patient.firstVisit,
        })
        .toJson();

    res.json(response);
}

function updateFirstVisit(req, res, next) {
    next();
}

function finishFirstVisit(req, res, next) {
    next();
}


module.exports = router;
