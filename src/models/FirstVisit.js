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
    dateOfDiagnosis: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "dateofdiagnosis",
    },
    firstWarfarin: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          reasonForWarfarin: this.reasonForWarfarin,
          dateOfFirstWarfarin: this.dateOfFirstWarfarin,
        }
      },
      set(values) {
        this.reasonForWarfarin= values.reasonForWarfarin;
        this.dateOfFirstWarfarin= values.dateOfFirstWarfarin;
      }
    },
    lastInrTest: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          hasUsedPortableDevice: this.hasUsedPortableDevice,
          dateOfLastInrTest: this.dateOfLastInrTest,
          lastInrValue: this.lastInrValue,
          lastInrTestLabInfo: this.lastInrTestLabInfo,
        }
      },
      set(values) {
        this.hasUsedPortableDevice= values.hasUsedPortableDevice;
        this.dateOfLastInrTest= values.dateOfLastInrTest;
        this.lastInrValue= values.lastInrValue;
        this.lastInrTestLabInfo= values.lastInrTestLabInfo;
      }
    },
    testResult: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          Hb: this.Hb,
          Hct: this.Hct,
          Plt: this.Plt,
          Bun: this.Bun,
          Urea: this.Urea,
          Cr: this.Cr,
          Na: this.Na,
          K: this.K,
          Alt: this.Alt,
          Ast: this.Ast,
        }
      },
      set(values) {
        this.Hb= values.Hb;
        this.Hct= values.Hct;
        this.Plt= values.Plt;
        this.Bun= values.Bun;
        this.Urea= values.Urea;
        this.Cr= values.Cr;
        this.Na= values.Na;
        this.K= values.K;
        this.Alt= values.Alt;
        this.Ast= values.Ast;
      }
    },
    medicalHistory: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          majorSurgery: this.majorSurgery,
          minorSurgery: this.minorSurgery,
          hospitalAdmission: this.hospitalAdmission,
          pastConditions: this.pastConditions,
        }
      },
      set(values) {
        this.majorSurgery= values.majorSurgery;
        this.minorSurgery= values.minorSurgery;
        this.hospitalAdmission= values.hospitalAdmission;
        this.pastConditions= values.pastConditions;
      }
    },
    physicalExam: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          bloodPressure: this.bloodPressure,
          heartBeat: this.heartBeat,
          respiratoryRate: this.respiratoryRate,
        }
      },
      set(values) {
        this.bloodPressure= values.bloodPressure;
        this.heartBeat= values.heartBeat;
        this.respiratoryRate= values.respiratoryRate;
      }
    },
    echocardiography: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          EF: this.EF,
          LAVI: this.LAVI,
          comment: this.comment,
        }
      },
      set(values) {
        this.EF= values.EF;
        this.LAVI= values.LAVI;
        this.comment= values.comment;
      }
    },
    flags: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          visitFlag: this.visitFlag,
          isSaved: this.isSaved,
          isEnded: this.isEnded,
        }
      },
      set(values) {
        this.visitFlag= values.visitFlag;
        this.isSaved= values.isSaved;
        this.isEnded= values.isEnded;
      }
    },
    inr: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          inrTargetRange: this.inrTargetRange,
          nextInrCheckDate: this.nextInrCheckDate,
        }
      },
      set(values) {
        this.inrTargetRange= values.inrTargetRange;
        this.nextInrCheckDate= values.nextInrCheckDate;
      }
    },
    visitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          day: this.day,
          month: this.month,
          year: this.year,
        }
      },
      set(values) {
        this.day= values.day;
        this.month= values.month;
        this.year= values.year;
      }
    },
    ECG: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ECG",
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "IDUserPatient",
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
    reasonForWarfarin: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ReasonforusingWarfarin",
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
    pastConditions: {
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
    },
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
