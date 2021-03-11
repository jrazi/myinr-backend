const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return FirstVisit.init(sequelize, DataTypes);
}

class FirstVisit extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "IDFirst",
    },
    reasonForWarfarin: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ReasonforusingWarfarin",
    },
    dateOfDiagnosis: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "dateofdiagnosis",
    },
    dateOfFirstWarfarin: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "dateoffirstWarfarin",
    },
    inrTargetRange: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "INRtargetrange",
    },
    lastInrValue: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "LastINR",
    },
    lastInrTestLabInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Lab",
    },
    hasUsedPortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "PortableDevice",
    },
    timeOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "TimeofINRTest",
    },
    dateOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "DateofINRTest",
    },
    bleedingOrClottingTypes: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "BleedingorClotting",
    },
    pastMedicalHistory: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "PastMedicalHistory",
    },
    majorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "MajorSurgery",
    },
    minorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "MinorSurgery",
    },
    hospitalAdmission: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "HospitalAdmission",
    },
    drugHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "DrugHistory",
    },
    habit: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: "Habit",
    },
    bloodPressure: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "bloodPressure",
    },
    heartBeat: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "PulseRate",
    },
    respiratoryRate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "RespiratoryRate",
    },
    Hb: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Hb",
    },
    Hct: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Hct",
    },
    Plt: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Plt",
    },
    Bun: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Bun",
    },
    Urea: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Urea",
    },
    Cr: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Cr",
    },
    Na: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Na",
    },
    K: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "K",
    },
    Alt: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Alt",
    },
    Ast: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Ast",
    },
    ECG: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ECG",
    },
    EF: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "EF",
    },
    LAVI: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "LAVI",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Comment",
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "IDUserPatient",
    },
    visitYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: "FYearVisit",
    },
    visitMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: "FMonthVisit",
    },
    visitDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: "FDayVisit",
    },
    visitFlag: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "FFlagVisit",
    },
    isSaved: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "FFlagSave",
    },
    isEnded: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "0",
      field: "FlagEndVisit",
    },
    reportComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "CommentReport",
    },
    nextInrCheckDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "NextINRCheck",
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
  return FirstVisit;
  }
}
