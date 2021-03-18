
var express = require('express');
var router = express.Router();
const errors = require("../../../api/errors");
const models = require("../../../models");
const User = require("../../../models").User

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const SimpleValidators = require("../../../src/util/SimpleValidators");
const ResponseTemplate = require("../../../api/ResponseTemplate");

router.get('/login', login);

async function login(req, res, next) {
    const username = req.query.username;
    const password = req.query.password;

    if (!SimpleValidators.hasValue(username) || !SimpleValidators.hasValue(password)) {
        next(new errors.QueryParameterMissing());
    }

    const user = await User.findOne({where: {username: username, password: password}});

    if (user == null) {
        next(new errors.UsernamePasswordMismatch());
        return;
    }

    const tokenSecret = process.env.TOKEN_SECRET;
    const accessToken = jwt.sign(
        {
            userId: user.userId,
            role: user.role
        },
        tokenSecret,
        {
            expiresIn: 1*30*24*3600,
        }
    );
    const response = ResponseTemplate.create()
        .withData({
            accessToken,
        })
        .toJson();

    res.json(response);

}


module.exports = router;
