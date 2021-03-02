
var express = require('express');
var router = express.Router();

router.use(authorizationFilter);

router.get('/me', getDoctorInfo);

router.get('/patient', getAllPatients);

router.get('/patient/:userId', getPatient);

router.get('/patient/:userId/firstVisit', getFirstVisitInfo);

router.put('/patient/:userId/firstVisit', updateFirstVisit);

router.put('/patient/:userId/firstVisit/finish', finishFirstVisit);

function authorizationFilter(req, res, next) {
    next();
}



function getDoctorInfo(req, res, next) {
    res.json({message: "Hello"});
    next();
}

function getPatient(req, res, next) {
    next();
}

function getAllPatients(req, res, next) {
    next();
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
