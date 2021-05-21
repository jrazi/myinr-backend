const {Op} = require("sequelize");

var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getAllPhysicians));
// router.put('', asyncFunctionWrapper(upsertPatient));

router.use('/:userId', (req, res, next) => {
    req.patientInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getPhysician));


async function getAllPhysicians(req, res, next) {

    let physicians = await models.Admin.findPhysicians(req.principal.userId);

    const response = ResponseTemplate.create()
        .withData({
            physicians: physicians,
        })
        .toJson();

    res.json(response);
}

async function getPhysician(req, res, next) {
    const physicianUserId = req.params.userId;

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

    const physician = await models.Physician.findOne({
        where: {
            userId: physicianUserId,
        },
        include: ['workPlaces'],
    });

    const sharesWorkPlace = physician.workPlaces
        .some(physicianWorkPlace => admin.workPlaces.some(adminWorkPlace => adminWorkPlace.placeId == physicianWorkPlace.placeId));

    if (!sharesWorkPlace) {
        next(new errors.PhysicianNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            physician: physician,
        })
        .toJson();

    res.json(response);
}

models.Admin.findPhysicians = async function (adminUserId) {

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

    const physicians = await models.Physician.findAll(
        {
            where: {
                userId: {
                    [Op.in]: distinctSharedUserPlaces.map(userPlace => userPlace.userId)
                }
            },
            include: ['workPlaces']
        }
    );

    return physicians || [];
}

module.exports = router;