
var express = require('express');
var router = express.Router();
const errors = require("../../../errors");
const models = require("../../../../models");
const User = require("../../../../models").User

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const SimpleValidators = require("../../../../util/SimpleValidators");
const ResponseTemplate = require("../../../ResponseTemplate");
const {asyncFunctionWrapper} = require("../../util");

router.get('/login', asyncFunctionWrapper(login));

async function login(req, res, next) {
    const username = req.query.username;
    const password = req.query.password;

    if (!SimpleValidators.hasValue(username) || !SimpleValidators.hasValue(password)) {
        next(new errors.QueryParameterMissing());
    }

    const user = await User.scope('withPassword').findOne({where: {username: username, password: password}});

    if (user == null) {
        next(new errors.UsernamePasswordMismatch());
        return;
    }

    let details = {};
    if (user.role == models.UserRoles.patient.id) {
        details = await models.Patient.findOne({where: {userId: user.userId}, include: ['userInfo', 'physician']});
    }
    else if (user.role == models.UserRoles.physician.id) {
        details = await models.Physician.findOne({where: {userId: user.userId}, include: ['userInfo', 'workPlaces'] });
    }

    const tokenSecret = process.env.TOKEN_SECRET;
    const accessToken = jwt.sign(
        {
            userId: user.userId,
            role: user.role,
        },
        tokenSecret,
        {
            expiresIn: 1*30*24*3600,
        }
    );
    const response = ResponseTemplate.create()
        .withData({
            accessToken,
            role: models.UserRoles.getById(user.role),
            details,
        })
        .toJson();

    res.json(response);

}


module.exports = router;
