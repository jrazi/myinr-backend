const {Op} = require("sequelize");

var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getPhysicianList));


async function getPhysicianList(req, res, next) {

    const physicians = await findPhysiciansWithSharedWorkplace(req.principal.userId);
    
    const response = ResponseTemplate.create()
        .withData({
            physicians: physicians,
        })
        .toJson();

    res.json(response);
}

async function findPhysiciansWithSharedWorkplace(secretaryUserId) {
    const workPlaces = await models.UserPlace.findAll(
        {
            where: {
                userId: secretaryUserId,
            }
        },
    );
    if (!workPlaces || !workPlaces.length) return [];

    const sharedUserPlaces = await models.UserPlace.findAll(
        {
            where: {
                placeId: {
                    [Op.in]: workPlaces.map(workPlace => workPlace.placeId),
                    [Op.ne]: secretaryUserId,
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