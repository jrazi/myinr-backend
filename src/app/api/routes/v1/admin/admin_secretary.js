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

async function upsertPatient(req, res, next) {

    const patientInfo = req.body.patient;

    if ((patientInfo || null) == null) {
        next(new errors.IncompleteRequest("Patient info was not provided."));
        return;
    }
    else if ((patientInfo.physicianUserId || null) == null) {
        next(new errors.IncompleteRequest("Field {physicianUserId} was not provided."));
        return;
    }
    else if ((patientInfo.nationalId || null) == null) {
        next(new errors.IncompleteRequest("Field {nationalId} was not provided."));
        return;
    }

    const secretary = await models.Secretary.findOne(
        {
            where: {
                userId: req.principal.userId
            },
            include: ['workPlaces']
        }
    );
    if (secretary == null) {
        next(new errors.SecretaryNotFound());
        return;
    }

    let physician = await models.Physician.findOne({
        where: {userId: patientInfo.physicianUserId},
        include: 'workPlaces',
    })

    if (physician == null ||
        (physician.workPlaces || []).filter(place => SimpleValidators.hasValue(place.id) && place.id == (secretary.workPlaces[0] || {}).id).length <= 0
    ) {
        next(new errors.PhysicianNotFound("Physician was not found"));
        return;
    }

    patientInfo.secretaryId = req.principal.userId;
    delete patientInfo.userInfo;

    const hasUserId = SimpleValidators.hasValue(patientInfo.userId);
    const patientQuery = [
        {
            nationalId: patientInfo.nationalId,
        },
    ];
    if (hasUserId) {
        patientQuery.push(
            {
                userId: patientInfo.userId,
            },
        );
    }
    let patient = await models.Patient.findOne({
        where: {
            [Op.or]: patientQuery,
        },
        include: ['userInfo'],
    })
    if (patient != null && hasUserId) {
        if (patient.secretaryId !== req.principal.userId) {
            next(new errors.IllegalOperation("You can not edit this patient"));
            return;
        }
        patientInfo.userId = patient.userId;
        patientInfo.patientId = patient.patientId;

        await models.Patient.update(
            patientInfo,
            {
                where: {
                    userId: patient.userId,
                },
                returning: true,
            }
        )

        let savedPatient = await patient.reload();

        const response =  ResponseTemplate.create()
            .withData({
                patient: savedPatient,
            });

        res.json(response);
        return;
    }
    else if (patient != null) {
        next(new errors.AlreadyExistsException("Patient with this national id already exists"));
        return;
    }
    else {

        await models.Visit.sequelize.transaction(async (tr) => {
            let createdUserInfo = await models.User.createPatient(patientInfo.nationalId, tr);
            patientInfo.userId = createdUserInfo.userId;
            delete patientInfo.patientId;

            let createdPatient = await models.Patient.create(patientInfo, {transaction: tr});
            createdPatient = createdPatient.get({plain: true});

            createdPatient.userInfo = createdUserInfo;
            const response =  ResponseTemplate.create()
                .withData({
                    patient: createdPatient,
                });

            res.json(response);
            return;
        })
    }

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
            }
        }
    );

    return secretaries || [];
}

module.exports = router;