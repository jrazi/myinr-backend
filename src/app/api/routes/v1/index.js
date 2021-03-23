var express = require('express');
const errors = require("../../errors");
const jwt = require("jsonwebtoken");
var router = express.Router();
var doctorRouter = require('./doctor/doctor');
var patientRouter = require('./patient/patient');
var authRouter = require('./authentication/auth');
const models = require("../../../models");

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
router.use('/doctor', doctorRouter);
router.use('/patient', patientRouter);
router.use('/auth', authRouter);
router.get('/me', redirectToRoleResource);

function redirectToRoleResource(req, res, next) {
  if (req.principal.role == models.UserRoles.patient.id)
    res.redirect(307, '/api/v1/patient/me');

  else if (req.principal.role == models.UserRoles.physician.id)
    res.redirect(307, '/api/v1/doctor/me');

  else throw new Error("Role not recognized.");
}

function authorizationFilter(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) throw new errors.UnauthorizedAccess();

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET, {}, (err, user) => {
    if (err) {
      next(new errors.UnauthorizedAccess());
      return;
    }
    req.principal = {
      userId: user.userId,
      role: user.role,
    }

    next();
  });


}

module.exports = router;
