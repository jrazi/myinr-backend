const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const DomainNameTable = require("./StaticDomainNameTable");

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
      defaultValue: "",
    },
    warfarinInfo: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          reasonForWarfarin: this.reasonForWarfarin,
          dateOfFirstWarfarin: this.dateOfFirstWarfarin,
        }
      },
      set(values) {
        this.reasonForWarfarin= values.reasonForWarfarin || this.reasonForWarfarin;
        this.dateOfFirstWarfarin= values.dateOfFirstWarfarin || this.dateOfFirstWarfarin;
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
        this.visitFlag= values.visitFlag || this.visitFlag;
        this.isSaved= values.isSaved || this.isSaved;
        this.isEnded= values.isEnded || this.isEnded;
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
      defaultValue: "-",
      get() {
        const rawValue = this.getDataValue('ECG');
        const [ecgId, avrBlockId] = DatabaseNormalizer.stringToList(rawValue, '-');

        const ecg = DomainNameTable[ecgId] || null;
        const avrBlock = DomainNameTable[avrBlockId] || null;

        return {
          ecg: ecg,
          avrBlock: avrBlock,
        };
      },
      set(value) {
        const {ecg, avrBlock} = value;
        const conditionsAsString = DatabaseNormalizer.listToString([ecg, avrBlock], '-');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('ECG', rawValue);
      }
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
      defaultValue: 1,
    },
    habit: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: "Habit",
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('habit');
        const habitIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const habits = habitIds.map(id => DomainNameTable[id]);

        return habits;
      },
      set(habitIdList) {
        const habitsAsString = DatabaseNormalizer.listToString(habitIdList, ',');
        const rawValue = `${habitsAsString}`;
        this.setDataValue('habit', rawValue);
      }
    },
    reasonForWarfarin: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ReasonforusingWarfarin",
      defaultValue: "-",
      get() {
        const rawValue = this.getDataValue('reasonForWarfarin');
        const [conditionsAsString, heartValveConditionsAsString] = DatabaseNormalizer.stringToList(rawValue, '-');
        const conditionIds = DatabaseNormalizer.stringToList(conditionsAsString, ',');
        const heartValveReplacementConditionIds = DatabaseNormalizer.stringToList(heartValveConditionsAsString, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);
        const heartValveReplacementConditions = heartValveReplacementConditionIds.map(id => DomainNameTable[id]);

        return {
          conditions,
          heartValveReplacementConditions,
        };
      },
      set(reasonIdList) {
        const [conditions, heartValveReplacementConditions] = [reasonIdList.conditions, reasonIdList.heartValveReplacementConditions];

        const conditionsAsString = DatabaseNormalizer.listToString(conditions, ',');
        const heartValveConditionsAsString = DatabaseNormalizer.listToString(heartValveReplacementConditions, ',');
        const rawValue = `${conditionsAsString}-${heartValveConditionsAsString}`;
        this.setDataValue('reasonForWarfarin', rawValue);
      }
    },
    dateOfFirstWarfarin: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "dateoffirstWarfarin",
      defaultValue: "",
    },
    inrTargetRange: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "INRtargetrange",
      defaultValue: "-",
      get() {
        const rawValue = this.getDataValue('inrTargetRange');
        const [from, to] = DatabaseNormalizer.stringToList(rawValue, '-');

        return {from, to};
      },
      set(inrRange) {
        const rangeAsString = DatabaseNormalizer.listToString([inrRange.from, inrRange.to], '-');
        this.setDataValue('inrTargetRange', rangeAsString);
      }
    },
    lastInrValue: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "LastINR",
      defaultValue: "",
    },
    lastInrTestLabInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Lab",
      defaultValue: "",
    },
    hasUsedPortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "PortableDevice",
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hasUsedPortableDevice'));
      },
      set(value) {
        this.setDataValue('hasUsedPortableDevice', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    timeOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "TimeofINRTest",
      defaultValue: "",
    },
    dateOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "DateofINRTest",
      defaultValue: "",
    },
    bleedingOrClottingTypes: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "BleedingorClotting",
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('bleedingOrClottingTypes');
        const conditionIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);

        return conditions;
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('bleedingOrClottingTypes', rawValue);
      }
    },
    pastConditions: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "PastMedicalHistory",
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('pastConditions');
        const conditionIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);

        return conditions;
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('pastConditions', rawValue);
      }
    },
    majorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "MajorSurgery",
      defaultValue: "",
    },
    minorSurgery: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "MinorSurgery",
      defaultValue: "",
    },
    hospitalAdmission: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "HospitalAdmission",
      defaultValue: "",
    },
    bloodPressure: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "bloodPressure",
      defaultValue: "-",
      get() {
        const rawValue = this.getDataValue('bloodPressure');
        const [systolic, diastolic] = DatabaseNormalizer.stringToList(rawValue, '-');

        return {systolic, diastolic};
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('pastConditions', rawValue);
      }
    },
    heartBeat: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "PulseRate",
      defaultValue: "",
    },
    respiratoryRate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "RespiratoryRate",
      defaultValue: "",
    },
    Hb: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Hb",
      defaultValue: "",
    },
    Hct: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Hct",
      defaultValue: "",
    },
    Plt: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Plt",
      defaultValue: "",
    },
    Bun: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Bun",
      defaultValue: "",
    },
    Urea: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Urea",
      defaultValue: "",
    },
    Cr: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Cr",
      defaultValue: "",
    },
    Na: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Na",
      defaultValue: "",
    },
    K: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "K",
      defaultValue: "",
    },
    Alt: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Alt",
      defaultValue: "",
    },
    Ast: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "Ast",
      defaultValue: "",
    },
    EF: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "EF",
      defaultValue: "",
    },
    LAVI: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "LAVI",
      defaultValue: "",
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "Comment",
      defaultValue: "",
    },
    visitYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: "FYearVisit",
      defaultValue: "",
    },
    visitMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: "FMonthVisit",
      defaultValue: "",
    },
    visitDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: "FDayVisit",
      defaultValue: "",
    },
    visitFlag: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "FFlagVisit",
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('visitFlag'));
      },
      set(value) {
        this.setDataValue('visitFlag', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    isSaved: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: "FFlagSave",
      defaultValue: "1",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('isSaved'));
      },
      set(value) {
        this.setDataValue('isSaved', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    isEnded: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "0",
      field: "FlagEndVisit",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('isEnded'));
      },
      set(value) {
        this.setDataValue('isEnded', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    reportComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "CommentReport",
      defaultValue: "",
    },
    nextInrCheckDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "NextINRCheck",
      defaultValue: "",
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

