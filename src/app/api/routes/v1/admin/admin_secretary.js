const {Op} = require("sequelize");

var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const TypeChecker = require("../../../../util/TypeChecker");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getAllSecretaries));
router.post('', asyncFunctionWrapper(addSecretary));

router.use('/:userId', (req, res, next) => {
    req.secretaryInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getSecretary));
router.put('/:userId', asyncFunctionWrapper(updateSecretary));


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

async function addSecretary(req, res, next) {

    const secretaryInfo = req.body.secretary;
    const placeId = req.query.placeId;

    if (!TypeChecker.isNumber(placeId)) {
        next(new errors.IncompleteRequest("placeId was not provided."));
        return;
    }
    if (!TypeChecker.isObject(secretaryInfo)) {
        next(new errors.IncompleteRequest("Secretary info was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(secretaryInfo.nationalId)) {
        next(new errors.IncompleteRequest("Field {nationalId} was not provided."));
        return;
    }

    const secretary = await models.Secretary.findOne(
        {
            where: {
                nationalId: secretaryInfo.nationalId
            },
        }
    );

    if (secretary != null) {
        next(new errors.AlreadyExistsException("A secretary with this national id already exists"));
        return;
    }

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
    else if (admin.workPlaces.length == 0) {
        next(new errors.IllegalOperation('You need to have a workplace before being able to add secretaries.'));
        return;
    }
    const adminHasThePlace = admin.workPlaces.some(workPlace => Number(workPlace.id) == Number(placeId));

    if (!adminHasThePlace) {
        next(new errors.NotFound("You do not work at the place with the specified id"));
        return;
    }


    delete secretaryInfo.id;
    delete secretaryInfo.userId;
    delete secretaryInfo.userInfo;

    await models.Secretary.sequelize.transaction(async (tr) => {
        let createdUserInfo = await models.User.createSecretary(secretaryInfo.nationalId, tr);
        secretaryInfo.userId = createdUserInfo.userId;

        let createdSecretary = await models.Secretary.create(secretaryInfo, {transaction: tr});
        createdSecretary = createdSecretary.get({plain: true});

        let createdPlace = await models.UserPlace.createPlace(createdSecretary.userId, placeId, tr);

        createdSecretary.userInfo = createdUserInfo;
        const response =  ResponseTemplate.create()
            .withData({
                secretary: createdSecretary,
                place: createdPlace,
            });

        res.json(response);
        return;
    })

}

async function updateSecretary(req, res, next) {

    const secretaryInfo = req.body.secretary;
    const secretaryUserId = req.secretaryInfo.userId;

    if (!TypeChecker.isObject(secretaryInfo)) {
        next(new errors.IncompleteRequest("Secretary info was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(secretaryInfo.nationalId)) {
        next(new errors.IncompleteRequest("Field {nationalId} was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(secretaryUserId)) {
        next(new errors.IncompleteRequest("Field {userId} was not provided."));
        return;
    }


    const secretary = await models.Secretary.findOne(
        {
            where: {
                userId: secretaryUserId,
            },
        }
    );

    if (!secretary) {
        next(new errors.SecretaryNotFound("No secretary was found with the provided userId"));
        return;
    }

    delete secretaryInfo.userInfo;

    secretaryInfo.userId = secretary.userId;
    secretaryInfo.id = secretary.id;

    await models.Secretary.update(
        secretaryInfo,
        {
            where: {
                userId: secretary.userId,
            },
            returning: true,
        }
    );

    let savedSecretary = await secretary.reload({include: ['workPlaces']});

    const response =  ResponseTemplate.create()
        .withData({
            secretary: savedSecretary,
        });

    res.json(response);
    return;

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