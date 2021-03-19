var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");


router.get('', getPatientInfo);



async function getPatientInfo(req, res, next) {
    const patient = await models.Patient.findOne({where: {userId: req.principal.userId}, include: ['userInfo', 'physician']});
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
