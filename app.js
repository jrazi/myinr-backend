var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/v1');
var doctorRouter = require('./routes/v1/doctor/doctor');
var patientRouter = require('./routes/v1/patient/patient');
var authRouter = require('./routes/v1/authentication/auth');
var errorHandlingRouter = require('./routes/v1/error_handlers');

var app = express();

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
app.use('/api/v1', errorHandlingRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({status: 404, code: "NOT_FOUND", message: "The endpoint you are looking for was not found."});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


