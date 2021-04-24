
var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');
const patientRouter = require('./patient/patient');
const appointmentRouter = require('./appointment/appointment');
const messageRouter = require('./message/message');
const drugsRouter = require('./drugs');

router.use(doctorAuthorizationFilter);
router.use('/me', meRouter);
router.use('/patient', patientRouter);
router.use('/appointment', appointmentRouter);
router.use('/message', messageRouter);
router.use('/drugs', drugsRouter);


function doctorAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.physician.id) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;

