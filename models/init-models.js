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
var _patientTbl = require("./Patient");
var _phAnTbl = require("./PhAnTbl");
var _physicianTbl = require("./Physician");
var _ptToPyTbl = require("./PtToPyTbl");
var _pyToPtTbl = require("./PyToPtTbl");
var _secondTbl = require("./SecondTbl");
var _secretaryTbl = require("./SecretaryTbl");
var _userTbl = require("./User");
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
  var FirstVisit = _firstTbl(sequelize, DataTypes);
  var hasBledTbl = _hasBledTbl(sequelize, DataTypes);
  var inrTestTbl = _inrTestTbl(sequelize, DataTypes);
  var items = _items(sequelize, DataTypes);
  var paDrTbl = _paDrTbl(sequelize, DataTypes);
  var Patient = _patientTbl(sequelize, DataTypes);
  var phAnTbl = _phAnTbl(sequelize, DataTypes);
  var Physician = _physicianTbl(sequelize, DataTypes);
  var ptToPyTbl = _ptToPyTbl(sequelize, DataTypes);
  var pyToPtTbl = _pyToPtTbl(sequelize, DataTypes);
  var secondTbl = _secondTbl(sequelize, DataTypes);
  var secretaryTbl = _secretaryTbl(sequelize, DataTypes);
  var User = _userTbl(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var flagTbl = _flagTbl(sequelize, DataTypes);

  Physician.belongsTo(User, {foreignKey: {name: 'userId', allowNull: false}, as: 'userInfo'});
  Patient.belongsTo(Physician, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'physician', targetKey: 'userId'});
  Physician.hasMany(Patient, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'patients', sourceKey: 'userId'});


  return {
    adminTbl,
    ansectorTbl,
    appointmentTbl,
    chadsVaScTbl,
    dosageTbl,
    drugTbl,
    firstDosageTbl,
    FirstVisit,
    hasBledTbl,
    inrTestTbl,
    items,
    paDrTbl,
    Patient,
    phAnTbl,
    Physician,
    ptToPyTbl,
    pyToPtTbl,
    secondTbl,
    secretaryTbl,
    User,
    event,
    flagTbl,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
