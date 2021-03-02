const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return firstTbl.init(sequelize, DataTypes);
}

class firstTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDFirst: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ReasonforusingWarfarin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dateofdiagnosis: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    dateoffirstWarfarin: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    INRtargetrange: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    LastINR: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Lab: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    TimeofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DateofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    BleedingorClotting: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PastMedicalHistory: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MajorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MinorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    HospitalAdmission: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DrugHistory: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Habit: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    BloodPressure: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PulseRate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RespiratoryRate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Hb: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Hct: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Plt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Bun: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Urea: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Cr: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Na: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    K: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Alt: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ast: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ECG: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EF: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    LAVI: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    IDUserPatient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FYearVisit: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    FMonthVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    FDayVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    FFlagVisit: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    FFlagSave: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    FlagEndVisit: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "((0))"
    },
    CommentReport: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    NextINRCheck: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FirstTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_FirstTbl",
        unique: true,
        fields: [
          { name: "IDFirst" },
        ]
      },
    ]
  });
  return firstTbl;
  }
}
