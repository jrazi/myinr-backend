
var express = require('express');
const {asyncFunctionWrapper} = require("../../../../util");
var router = express.Router();

router.get('', asyncFunctionWrapper(getAllVisits));


async function getAllVisits(req, res, next) {

}

module.exports = router;

