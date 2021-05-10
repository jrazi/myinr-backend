var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');
const messageRouter = require('./message');
const physicianRouter = require('./physician');
const appointmentRouter = require('./appointment');

router.use(patientAuthorizationFilter);
router.use('/me', meRouter);
router.use('/message', messageRouter);
router.use('/physician', physicianRouter);
router.use('/appointment', appointmentRouter);

function patientAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.patient.id) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;
