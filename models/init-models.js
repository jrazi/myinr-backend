var DataTypes = require("sequelize").DataTypes;
var _adminTbl = require("./AdminTbl");
var _ansectorTbl = require("./AnsectorTbl");
var _appointmentTbl = require("./AppointmentTbl");
var _chadsVaScTbl = require("./Cha2ds2vascScore");
var _dosageTbl = require("./DosageTbl");
var _drugTbl = require("./DrugTbl");
var _firstDosageTbl = require("./FirstWarfarinDosage");
var _firstTbl = require("./FirstVisit");
var _hasBledTbl = require("./HasBledStage");
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
  var Cha2ds2vascScore = _chadsVaScTbl(sequelize, DataTypes);
  var dosageTbl = _dosageTbl(sequelize, DataTypes);
  var drugTbl = _drugTbl(sequelize, DataTypes);
  var FirstWarfarinDosage = _firstDosageTbl(sequelize, DataTypes);
  var FirstVisit = _firstTbl(sequelize, DataTypes);
  var HasBledStage = _hasBledTbl(sequelize, DataTypes);
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

  FirstVisit.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasOne(FirstVisit, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'firstVisit', sourceKey: 'userId'});

  HasBledStage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(HasBledStage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'hasBledScore', sourceKey: 'userId'});

  Cha2ds2vascScore.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(Cha2ds2vascScore, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'cha2ds2Score', sourceKey: 'userId'});

  FirstWarfarinDosage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(FirstWarfarinDosage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'firstWarfarinDosage', sourceKey: 'userId'});


  return {
    adminTbl,
    ansectorTbl,
    appointmentTbl,
    Cha2ds2vascScore,
    dosageTbl,
    drugTbl,
    FirstWarfarinDosage,
    FirstVisit,
    HasBledStage,
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
