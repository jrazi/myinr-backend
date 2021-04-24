var DataTypes = require("sequelize").DataTypes;
var _adminTbl = require("./AdminTbl");
var _ansectorTbl = require("./Place");
var _appointmentTbl = require("./VisitAppointment");
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
var _phAnTbl = require("./UserPlace");
var _physicianTbl = require("./Physician");
var _ptToPyTbl = require("./PatientToPhysicianMessage");
var _pyToPtTbl = require("./PhysicianToPatientMessage");
var _secondTbl = require("./Visit");
var _secretaryTbl = require("./SecretaryTbl");
var _userTbl = require("./User");
var _event = require("./Event");
var _flagTbl = require("./FlagTbl");

function initModels(sequelize) {
  var adminTbl = _adminTbl(sequelize, DataTypes);
  var Place = _ansectorTbl(sequelize, DataTypes);
  var VisitAppointment = _appointmentTbl(sequelize, DataTypes);
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
  var UserPlace = _phAnTbl(sequelize, DataTypes);
  var Physician = _physicianTbl(sequelize, DataTypes);
  var PatientToPhysicianMessage = _ptToPyTbl(sequelize, DataTypes);
  var PhysicianToPatientMessage = _pyToPtTbl(sequelize, DataTypes);
  var Visit = _secondTbl(sequelize, DataTypes);
  var secretaryTbl = _secretaryTbl(sequelize, DataTypes);
  var User = _userTbl(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var flagTbl = _flagTbl(sequelize, DataTypes);

  Physician.belongsTo(User, {foreignKey: {name: 'userId', allowNull: false}, as: 'userInfo'});
  Patient.belongsTo(User, {foreignKey: {name: 'userId', allowNull: false}, as: 'userInfo'});

  Patient.belongsTo(Physician, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'physician', targetKey: 'userId'});
  Physician.hasMany(Patient, {foreignKey: {name: 'physicianUserId', allowNull: true}, as: 'patients', sourceKey: 'userId'});

  FirstVisit.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasOne(FirstVisit, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'firstVisit', sourceKey: 'userId'});

  HasBledStage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(HasBledStage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'hasBledScore', sourceKey: 'userId'});

  Cha2ds2vascScore.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(Cha2ds2vascScore, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'cha2ds2Score', sourceKey: 'userId'});

  PatientMedicationRecord.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(PatientMedicationRecord, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'medicationHistory', sourceKey: 'userId'});

  WarfarinWeekDosage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(WarfarinWeekDosage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'warfarinWeeklyDosages', sourceKey: 'userId'});

  WarfarinDosageRecord.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(WarfarinDosageRecord, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'warfarinDosageRecords', sourceKey: 'userId'});

  Visit.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(Visit, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'visits', sourceKey: 'userId'});

  VisitAppointment.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(VisitAppointment, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'appointments', sourceKey: 'userId'});

  Physician.belongsToMany(Place, {through: UserPlace, foreignKey: 'userId', otherKey: 'placeId', uniqueKey: 'id', sourceKey: 'userId', targetKey: 'id', as: 'workPlaces', });

  PatientToPhysicianMessage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(PatientToPhysicianMessage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'messagesToPhysician', sourceKey: 'userId'});

  PhysicianToPatientMessage.belongsTo(Patient, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'patientInfo', targetKey: 'userId'});
  Patient.hasMany(PhysicianToPatientMessage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'messagesFromPhysician', sourceKey: 'userId'});

  PhysicianToPatientMessage.belongsTo(Physician, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'physicianInfo', targetKey: 'userId'});
  Physician.hasMany(PhysicianToPatientMessage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'messagesToPatients', sourceKey: 'userId'});

  PatientToPhysicianMessage.belongsTo(Physician, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'physicianInfo', targetKey: 'userId'});
  Physician.hasMany(PatientToPhysicianMessage, {foreignKey: {name: 'patientUserId', allowNull: false}, as: 'messagesFromPatients', sourceKey: 'userId'});


  return {
    adminTbl,
    Place,
    VisitAppointment,
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
    UserPlace,
    Physician,
    PatientToPhysicianMessage,
    PhysicianToPatientMessage,
    Visit,
    secretaryTbl,
    User,
    event,
    flagTbl,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
