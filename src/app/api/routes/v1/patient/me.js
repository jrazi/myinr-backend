var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const ListUtil = require("../../../../util/ListUtil");
const {asyncFunctionWrapper} = require("../../util");


router.get('', asyncFunctionWrapper(getPatientInfo));



async function getPatientInfo(req, res, next) {
    const patient = await models.Patient.findOne(
        {
            where: {
                userId: req.principal.userId
            },
            include: ['userInfo', 'physician']
        }
    );
    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }
    const dosageRecords = await models.WarfarinDosageRecord.scope({method: ['lastRecordsOfPatient', req.principal.userId]}).findAll();

    const patientData = patient.get({plain: true});
    patientData.latestWarfarinDosage = dosageRecords;

    const response = ResponseTemplate.create()
        .withData({
            patient: patientData,
        })
        .toJson();

    res.json(response);
}


module.exports = router;
