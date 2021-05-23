var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');
const patientRouter = require('./secretary_patient');
const physicianRouter = require('./secretary_physician');

router.use(secretaryAuthorizationFilter);
router.use('/me', meRouter);
router.use('/patient', patientRouter);
router.use('/physician', physicianRouter);

function secretaryAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.secretary.id) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;
