var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const ListUtil = require("../../../../util/ListUtil");
const {asyncFunctionWrapper} = require("../../util");


router.get('', asyncFunctionWrapper(getSecretaryInfo));



async function getSecretaryInfo(req, res, next) {
    const secretary = await models.Secretary.findOne(
        {
            where: {
                userId: req.principal.userId
            },
            include: ['userInfo', 'workPlaces']
        }
    );
    if (secretary == null) {
        next(new errors.SecretaryNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            secretary: secretary,
        })
        .toJson();

    res.json(response);
}


module.exports = router;
