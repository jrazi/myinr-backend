var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/v1');
var doctorRouter = require('./routes/v1/doctor/doctor');
var patientRouter = require('./routes/v1/patient/patient');
var authRouter = require('./routes/v1/authentication/auth');
var ApiError = require('./api/errors').ApiError;

var app = express();

const dotenv = require("dotenv");
dotenv.config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/auth', authRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({status: 404, code: "NOT_FOUND", message: "The endpoint you are looking for was not found.", data: {}});
});

app.use(function(err, req, res, next) {
  if (err == null || err == undefined || !(err instanceof ApiError))
    next(err);
  else res.status(err.status).json({status: err.status, code: err.code, message: err.message, data: {}});
});

app.use(function(err, req, res, next) {
  res.status(400).json({status: 400, code: "ERROR", message: "There was a problem.", data: {}});
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



