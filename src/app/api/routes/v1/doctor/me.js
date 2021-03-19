
var express = require('express');
var router = express.Router();
const { Op } = require("sequelize");

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");

router.get('', getDoctorInfo);

async function getDoctorInfo(req, res, next) {
    const doctor = await models.Physician.findOne({where: {userId: req.principal.userId}, include: 'userInfo'});
    if (doctor == null) {
        next(new errors.PhysicianNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            doctor: doctor,
        })
        .toJson();

    res.json(response);
}

module.exports = router;