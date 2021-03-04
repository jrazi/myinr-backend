var DataTypes = require("sequelize").DataTypes;
var _adminTbl = require("./AdminTbl");
var _ansectorTbl = require("./AnsectorTbl");
var _appointmentTbl = require("./AppointmentTbl");
var _chadsVaScTbl = require("./ChadsVaScTbl");
var _dosageTbl = require("./DosageTbl");
var _drugTbl = require("./DrugTbl");
var _firstDosageTbl = require("./FirstDosageTbl");
var _firstTbl = require("./FirstTbl");
var _hasBledTbl = require("./HasBledTbl");
var _inrTestTbl = require("./InrTestTbl");
var _items = require("./Items");
var _paDrTbl = require("./PaDrTbl");
var _patientTbl = require("./PatientTbl");
var _phAnTbl = require("./PhAnTbl");
var _physicianTbl = require("./Physician");
var _ptToPyTbl = require("./PtToPyTbl");
var _pyToPtTbl = require("./PyToPtTbl");
var _secondTbl = require("./SecondTbl");
var _secretaryTbl = require("./SecretaryTbl");
var _userTbl = require("./UserTbl");
var _event = require("./Event");
var _flagTbl = require("./FlagTbl");

function initModels(sequelize) {
  var adminTbl = _adminTbl(sequelize, DataTypes);
  var ansectorTbl = _ansectorTbl(sequelize, DataTypes);
  var appointmentTbl = _appointmentTbl(sequelize, DataTypes);
  var chadsVaScTbl = _chadsVaScTbl(sequelize, DataTypes);
  var dosageTbl = _dosageTbl(sequelize, DataTypes);
  var drugTbl = _drugTbl(sequelize, DataTypes);
  var firstDosageTbl = _firstDosageTbl(sequelize, DataTypes);
  var firstTbl = _firstTbl(sequelize, DataTypes);
  var hasBledTbl = _hasBledTbl(sequelize, DataTypes);
  var inrTestTbl = _inrTestTbl(sequelize, DataTypes);
  var items = _items(sequelize, DataTypes);
  var paDrTbl = _paDrTbl(sequelize, DataTypes);
  var patientTbl = _patientTbl(sequelize, DataTypes);
  var phAnTbl = _phAnTbl(sequelize, DataTypes);
  var Physician = _physicianTbl(sequelize, DataTypes);
  var ptToPyTbl = _ptToPyTbl(sequelize, DataTypes);
  var pyToPtTbl = _pyToPtTbl(sequelize, DataTypes);
  var secondTbl = _secondTbl(sequelize, DataTypes);
  var secretaryTbl = _secretaryTbl(sequelize, DataTypes);
  var userTbl = _userTbl(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var flagTbl = _flagTbl(sequelize, DataTypes);


  return {
    adminTbl,
    ansectorTbl,
    appointmentTbl,
    chadsVaScTbl,
    dosageTbl,
    drugTbl,
    firstDosageTbl,
    firstTbl,
    hasBledTbl,
    inrTestTbl,
    items,
    paDrTbl,
    patientTbl,
    phAnTbl,
    Physician,
    ptToPyTbl,
    pyToPtTbl,
    secondTbl,
    secretaryTbl,
    userTbl,
    event,
    flagTbl,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
