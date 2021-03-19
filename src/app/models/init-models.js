var DataTypes = require("sequelize").DataTypes;
var _adminTbl = require("./AdminTbl");
var _ansectorTbl = require("./AnsectorTbl");
var _appointmentTbl = require("./AppointmentTbl");
var _chadsVaScTbl = require("./Cha2ds2vascScore");
var _dosageTbl = require("./WarfarinDosageRecord");
var _drugTbl = require("./DrugInfo");
var _firstDosageTbl = require("./WarfarinWeekDosage");
var _firstTbl = require("./FirstVisit");
var _hasBledTbl = require("./HasBledStage");
var _inrTestTbl = require("./InrTestTbl");
var _items = require("./DomainNameTable");
var _paDrTbl = require("./PatientMedicationRecord");
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
  var WarfarinDosageRecord = _dosageTbl(sequelize, DataTypes);
  var DrugInfo = _drugTbl(sequelize, DataTypes);
  var WarfarinWeekDosage = _firstDosageTbl(sequelize, DataTypes);
  var FirstVisit = _firstTbl(sequelize, DataTypes);
  var HasBledStage = _hasBledTbl(sequelize, DataTypes);
  var inrTestTbl = _inrTestTbl(sequelize, DataTypes);
  var DomainNameTable = _items(sequelize, DataTypes);
  var PatientMedicationRecord = _paDrTbl(sequelize, DataTypes);
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
  Patient.belongsTo(User, {foreignKey: {name: 'userId', allowNull: false}, as: 'userInfo'});

  Patient.belongsTo(Physician, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'physician', targetKey: 'userId'});
  Physician.hasMany(Patient, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'patients', sourceKey: 'userId'});

  FirstVisit.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasOne(FirstVisit, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'firstVisit', sourceKey: 'userId', targetKey: 'itemId',});

  HasBledStage.removeAttribute('id');
  HasBledStage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasMany(HasBledStage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'hasBledScore', sourceKey: 'userId', targetKey: 'itemId',});

  Cha2ds2vascScore.removeAttribute('id');
  Cha2ds2vascScore.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasMany(Cha2ds2vascScore, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'cha2ds2Score', sourceKey: 'userId', targetKey: 'itemId',});

  PatientMedicationRecord.removeAttribute('id');
  PatientMedicationRecord.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasMany(PatientMedicationRecord, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'medicationHistory', sourceKey: 'userId', targetKey: 'itemId',});

  FirstVisit.removeAttribute('id');
  WarfarinWeekDosage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasMany(WarfarinWeekDosage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'warfarinWeeklyDosages', sourceKey: 'userId', targetKey: 'itemId',});

  WarfarinDosageRecord.removeAttribute('id');
  WarfarinDosageRecord.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId', sourceKey: 'itemId',});
  Patient.hasMany(WarfarinDosageRecord, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'warfarinDosageRecords', sourceKey: 'userId', targetKey: 'itemId',});

  return {
    adminTbl,
    ansectorTbl,
    appointmentTbl,
    Cha2ds2vascScore,
    WarfarinDosageRecord,
    DrugInfo,
    WarfarinWeekDosage,
    FirstVisit,
    HasBledStage,
    inrTestTbl,
    DomainNameTable,
    PatientMedicationRecord,
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
