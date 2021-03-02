const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return patientTbl.init(sequelize, DataTypes);
}

class patientTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDPatient: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FNamePatient: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    NIDPatient: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PhonePatient: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IDPhysicianPatient: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BirthDatePatient: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PrescriptionPatient: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    EmailPatient: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IDUserPatient: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LNamePatient: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Gender: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    FatherName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BirthPlace: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Mobile: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EssentialPhone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IDSecretaryPatient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CausePatient: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PatientTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PatientTbl",
        unique: true,
        fields: [
          { name: "IDPatient" },
        ]
      },
    ]
  });
  return patientTbl;
  }
}
