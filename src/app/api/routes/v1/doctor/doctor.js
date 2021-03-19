
var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');
const patientRouter = require('./patient');
const drugsRouter = require('./drugs');

router.use(doctorAuthorizationFilter);
router.use('/me', meRouter);
router.use('/patient', patientRouter);
router.use('/drugs', drugsRouter);


function doctorAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.physician.itemId) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;

