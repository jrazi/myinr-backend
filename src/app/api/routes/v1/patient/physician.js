var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const TypeChecker = require("../../../../util/TypeChecker");
const JalaliDate = require("../../../../util/JalaliDate");
const JalaliTime = require("../../../../util/JalaliTime");
const {asyncFunctionWrapper} = require("../../util");


router.get('', asyncFunctionWrapper(getPhysicianInfo));


async function getPhysicianInfo(req, res, next) {
    throw new Error("not implemented");
}

module.exports = router;
