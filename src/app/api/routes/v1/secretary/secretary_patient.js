
var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getAllPatients));

router.use('/:userId', (req, res, next) => {
    req.patientInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getPatient));


async function getAllPatients(req, res, next) {
    const secretary = await models.Secretary.findOne({
        where: {
            userId: req.principal.userId
        },
        include: [
            {
                model: models.Patient,
                as: 'patients',
            },
        ],
    });
    if (secretary == null) {
        next(new errors.SecretaryNotFound());
        return;
    }

    let patientsList = secretary.patients;

    const response = ResponseTemplate.create()
        .withData({
            patients: patientsList,
        })
        .toJson();

    res.json(response);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;

    const patient = await models.Patient.findOne({
        where: {
            userId: patientUserId,
            secretaryId: req.principal.userId
        },
        include: [],
    });

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