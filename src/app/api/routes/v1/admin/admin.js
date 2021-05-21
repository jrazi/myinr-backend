var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

const meRouter = require('./me');
const physicianRouter = require('./admin_physician');
const secretaryRouter = require('./admin_secretary');

router.use(adminAuthorizationFilter);
router.use('/me', meRouter);
router.use('/physician', physicianRouter);
router.use('/secretary', secretaryRouter);

function adminAuthorizationFilter(req, res, next) {
    const principal = req.principal;

    if (principal.role !== models.UserRoles.admin.id) {
        throw new errors.AccessForbidden();
    }
    next();
}

module.exports = router;
