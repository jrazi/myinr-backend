const {Op} = require("sequelize");

var express = require('express');
var router = express.Router();

const models = require("../../../../models");
const errors = require("../../../errors");
const ResponseTemplate = require("../../../ResponseTemplate");
const SequelizeUtil = require("../../../../util/SequelizeUtil");
const SimpleValidators = require("../../../../util/SimpleValidators");
const {asyncFunctionWrapper} = require("../../util");

router.get('', asyncFunctionWrapper(getAllPatients));
router.put('', asyncFunctionWrapper(upsertPatient));

router.use('/:userId', (req, res, next) => {
    req.patientInfo = {
        userId: req.params.userId,
    };
    next();
})

router.get('/:userId', asyncFunctionWrapper(getPatient));


async function getAllPatients(req, res, next) {
    const secretary = await models.Secretary.findOne({
        where: {
            userId: req.principal.userId
        },
        include: [
            {
                model: models.Patient,
                as: 'patients',
            },
        ],
    });
    if (secretary == null) {
        next(new errors.SecretaryNotFound());
        return;
    }

    let patientsList = secretary.patients;

    const response = ResponseTemplate.create()
        .withData({
            patients: patientsList,
        })
        .toJson();

    res.json(response);
}

async function getPatient(req, res, next) {
    const patientUserId = req.params.userId;

    const patient = await models.Patient.findOne({
        where: {
            userId: patientUserId,
            secretaryId: req.principal.userId
        },
        include: [],
    });

    if (patient == null) {
        next(new errors.PatientNotFound());
        return;
    }

    const response = ResponseTemplate.create()
        .withData({
            patient: patient,
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

module.exports = router;