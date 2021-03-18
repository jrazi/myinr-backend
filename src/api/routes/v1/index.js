var express = require('express');
const errors = require("../../errors");
const jwt = require("jsonwebtoken");
var router = express.Router();

const unless = function(path, middleware) {
  return function(req, res, next) {
    if (new RegExp(path).test(req.path)) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

router.use(unless(/^\/(auth).*$/, authorizationFilter));

function authorizationFilter(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) throw new errors.UnauthorizedAccess();

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, user) => {
    if (err) {
      next(new errors.UnauthorizedAccess());
      return;
    }
    console.log("user is", user);
    req.principal = {
      userId: user.userId,
      role: user.role,
    }

    next();
  });


}

module.exports = router;
