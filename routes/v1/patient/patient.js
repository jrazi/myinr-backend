var express = require('express');
var router = express.Router();

const Physician = require("../../../models").Physician
const User = require("../../../models").User
const Patient = require("../../../models").Patient
const models = require("../../../models");
const errors = require("../../../api/errors");
const ResponseTemplate = require("../../../api/ResponseTemplate");
const SequelizeUtil = require("../../../src/util/SequelizeUtil");


router.use(authorizationFilter);

router.get('/me', getPatientInfo);


function authorizationFilter(req, res, next) {
    req.principal = {
        userId: 9133,
    }
    next();
}


async function getPatientInfo(req, res, next) {
    const patient = await Patient.findOne({where: {userId: req.principal.userId}, include: ['userInfo', 'physician']});
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


module.exports = router;
