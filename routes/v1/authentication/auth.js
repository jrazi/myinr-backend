
var express = require('express');
var router = express.Router();

router.get('/login', login);

function login(req, res, next) {
    next();
}


module.exports = router;
