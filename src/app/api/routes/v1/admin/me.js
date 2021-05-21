var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const ListUtil = require("../../../../util/ListUtil");
const {asyncFunctionWrapper} = require("../../util");


router.get('', asyncFunctionWrapper(getAdminInfo));



async function getAdminInfo(req, res, next) {
    const admin = await models.Admin.findOne(
        {
            where: {
                userId: req.principal.userId
            },
            include: ['userInfo', 'workPlaces']
        }
    );
    if (admin == null) {
        next(new errors.AdminNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            admin: admin,
        })
        .toJson();

    res.json(response);
}


module.exports = router;
