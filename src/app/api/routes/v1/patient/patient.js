var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');

router.use(patientAuthorizationFilter);
router.use('/me', meRouter);


function patientAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.patient.id) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;
