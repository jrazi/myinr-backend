const {Op} = require("sequelize");

var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getAllSecretaries));
// router.put('', asyncFunctionWrapper(upsertPatient));

router.use('/:userId', (req, res, next) => {
    req.patientInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getSecretary));


async function getAllSecretaries(req, res, next) {

    let secretaries = await models.Admin.findSecretaries(req.principal.userId);

    const response = ResponseTemplate.create()
        .withData({
            secretaries: secretaries,
        })
        .toJson();

    res.json(response);
}

async function getSecretary(req, res, next) {
    const secretaryUserId = req.params.userId;

    const admin = await models.Admin.findOne(
        {
            where: {
                userId: req.principal.userId
            },
            include: ['workPlaces']
        }
    );
    if (admin == null) {
        next(new errors.AdminNotFound());
        return;
    }

    const secretary = await models.Secretary.findOne({
        where: {
            userId: secretaryUserId,
        },
        include: ['workPlaces'],
    });

    const sharesWorkPlace = secretary.workPlaces
        .some(secretaryWorkPlace => admin.workPlaces.some(adminWorkPlace => adminWorkPlace.placeId == secretaryWorkPlace.placeId));

    if (!sharesWorkPlace) {
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

models.Admin.findSecretaries = async function (adminUserId) {

    if (!SimpleValidators.isNumber(adminUserId))
        throw new Error("Admin user id must be a number");

    const workPlaces = await models.UserPlace.findAll(
        {
            where: {
                userId: adminUserId,
            }
        },
    );
    if (!workPlaces || !workPlaces.length) return [];

    const sharedUserPlaces = await models.UserPlace.findAll(
        {
            where: {
                placeId: {
                    [Op.in]: workPlaces.map(workPlace => workPlace.placeId),
                    [Op.ne]: adminUserId,
                },
            }
        }
    )

    const distinctSharedUserPlaces = sharedUserPlaces.filter((tag, index, array) => array.findIndex(t => t.userId == tag.userId) == index);

    if (!distinctSharedUserPlaces || !distinctSharedUserPlaces.length)
        return [];

    const secretaries = await models.Secretary.findAll(
        {
            where: {
                userId: {
                    [Op.in]: distinctSharedUserPlaces.map(userPlace => userPlace.userId)
                }
            },
            include: ['workPlaces']
        }
    );

    return secretaries || [];
}

module.exports = router;