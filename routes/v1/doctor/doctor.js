
var express = require('express');
var router = express.Router();
var AccessDenied = require("../../../api/errors").AccessDenied;
const Physician = require("../../../models").Physician
const User = require("../../../models").User
const Patient = require("../../../models").Patient

router.use(authorizationFilter);

router.get('/me', getDoctorInfo);

router.get('/patient', getAllPatients);

router.get('/patient/:userId', getPatient);

router.get('/patient/:userId/firstVisit', getFirstVisitInfo);

router.put('/patient/:userId/firstVisit', updateFirstVisit);

router.put('/patient/:userId/firstVisit/finish', finishFirstVisit);

function authorizationFilter(req, res, next) {
    req.principal = {
        userId: 3122,
        physicianId: 3017,
    }
    next();
}



async function getDoctorInfo(req, res, next) {
    const doctor = await Physician.findOne({where: {userId: req.principal.userId}, include: 'userInfo'});
    res.json(doctor);
}


async function getAllPatients(req, res, next) {
    const doctor = await Physician.findOne({where: {userId: req.principal.userId}, include: {model: Patient, as: 'patients'},});
    res.json(doctor.patients);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;
    const patient = await Patient.findOne({where: {userId: patientUserId},});
    res.json(patient);
}

function getFirstVisitInfo(req, res, next) {
    next();
}

function updateFirstVisit(req, res, next) {
    next();
}

function finishFirstVisit(req, res, next) {
    next();
}


module.exports = router;
