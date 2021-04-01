
const express = require('express');
const router = express.Router();

const models = require('../../../../../../models');
const ResponseTemplate = require("../../../../../ResponseTemplate");
const {asyncFunctionWrapper} = require("../../../../util");

router.get('/:appointmentId', asyncFunctionWrapper(getAppointment));
router.get('/:appointmentId/:visitId', asyncFunctionWrapper(getVisit));

router.get('', asyncFunctionWrapper(getAppointmentList));

async function getAppointmentList(req, res, next) {
    const patientUserId = req.patientInfo.userId;

    const scopes = [
        'defaultScope',
        req.query.attended ? 'attended' : null,
        req.query.expired ? 'expired' : null,
    ].filter(item => item != null);


    const appointmentList = await models.VisitAppointment.scope(scopes).findAll({
        where: {
            patientUserId: patientUserId,
        }
    });

    const response =  ResponseTemplate.create()
        .withData({
            appointments: appointmentList,
        });

    res.json(response);

}

async function getAppointment(req, res, next) {
    const patientUserId = req.patientInfo.userId;
    const appointmentId = req.params.appointmentId;

    const appointment = await models.VisitAppointment.findOne({
        where: {
            id: appointmentId,
            patientUserId: patientUserId,
        }
    });

    const response =  ResponseTemplate.create()
        .withData({
            appointment,
        });

    res.json(response);
}

async function getVisit(req, res, next) {

}


module.exports = router;
