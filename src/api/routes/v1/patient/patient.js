var express = require('express');
var router = express.Router();

const Physician = require("../../../../models").Physician
const User = require("../../../../models").User
const Patient = require("../../../../models").Patient
const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");


router.get('/me', getPatientInfo);



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
