
var express = require('express');
var router = express.Router();
const { Op, fn, col, where } = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../util");


router.get('/search', asyncFunctionWrapper(searchDrugs));


async function searchDrugs(req, res, next) {
    const name = req.query.name;
    if (!SimpleValidators.hasValue(name)) {
        next(new errors.QueryParameterMissing());
        return;
    }

    const drugs = await models.DrugInfo.findAll({
        where: {
            drugName: where(fn('LOWER', col('drugName')), 'LIKE', `%${name}%`)
        },
    });

    const response = ResponseTemplate.create()
        .withData({drugs})
        .toJson();

    res.json(response);
}


module.exports = router;