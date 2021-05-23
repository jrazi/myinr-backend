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

router.get('', asyncFunctionWrapper(getAllPhysicians));
router.post('', asyncFunctionWrapper(addPhysician));

router.use('/:userId', (req, res, next) => {
    req.physicianInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getPhysician));
router.put('/:userId', asyncFunctionWrapper(updatePhysician));


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

async function addPhysician(req, res, next) {

    const physicianInfo = req.body.physician;

    if (!TypeChecker.isObject(physicianInfo)) {
        next(new errors.IncompleteRequest("Physician info was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(physicianInfo.nationalId)) {
        next(new errors.IncompleteRequest("Field {nationalId} was not provided."));
        return;
    }

    const physician = await models.Physician.findOne(
        {
            where: {
                nationalId: physicianInfo.nationalId
            },
        }
    );

    if (physician != null) {
        next(new errors.AlreadyExistsException("A physician with this national id already exists"));
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
        next(new errors.IllegalOperation('You need to have a workplace before being able to add physicians.'));
        return;
    }
    const placeId = SimpleValidators.hasValue(req.query.placeId) ? req.query.placeId : admin.workPlaces[0].id;
    
    const adminHasThePlace = admin.workPlaces.some(workPlace => Number(workPlace.id) == Number(placeId));

    if (!adminHasThePlace) {
        next(new errors.NotFound("You do not work at the place with the specified id"));
        return;
    }


    delete physicianInfo.id;
    delete physicianInfo.userId;
    delete physicianInfo.userInfo;

    await models.Physician.sequelize.transaction(async (tr) => {
        let createdUserInfo = await models.User.createPhysician(physicianInfo.nationalId, tr);
        physicianInfo.userId = createdUserInfo.userId;

        let createdPhysician = await models.Physician.create(physicianInfo, {transaction: tr});
        createdPhysician = createdPhysician.get({plain: true});

        let createdPlace = await models.UserPlace.createPlace(createdPhysician.userId, placeId, tr);

        createdPhysician.userInfo = createdUserInfo;
        const response =  ResponseTemplate.create()
            .withData({
                physician: createdPhysician,
                place: createdPlace,
            });

        res.json(response);
        return;
    })

}

async function updatePhysician(req, res, next) {

    const physicianInfo = req.body.physician;
    const physicianUserId = req.physicianInfo.userId;

    if (!TypeChecker.isObject(physicianInfo)) {
        next(new errors.IncompleteRequest("Physician info was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(physicianInfo.nationalId)) {
        next(new errors.IncompleteRequest("Field {nationalId} was not provided."));
        return;
    }
    else if (!SimpleValidators.isNonEmptyString(physicianUserId)) {
        next(new errors.IncompleteRequest("Field {userId} was not provided."));
        return;
    }


    const physician = await models.Physician.findOne(
        {
            where: {
                userId: physicianUserId,
            },
        }
    );

    if (!physician) {
        next(new errors.PhysicianNotFound("No physician was found with the provided userId"));
        return;
    }

    delete physicianInfo.userInfo;

    physicianInfo.userId = physician.userId;
    physicianInfo.id = physician.id;

    await models.Physician.update(
        physicianInfo,
        {
            where: {
                userId: physician.userId,
            },
            returning: true,
        }
    );

    let savedPhysician = await physician.reload({include: ['workPlaces']});

    const response =  ResponseTemplate.create()
        .withData({
            physician: savedPhysician,
        });

    res.json(response);
    return;

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