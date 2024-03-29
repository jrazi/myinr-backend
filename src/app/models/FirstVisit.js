const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const {firstWithValue} = DatabaseNormalizer;
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
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "IDUserPatient",
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
        this.reasonForWarfarin= firstWithValue(values.reasonForWarfarin, this.reasonForWarfarin);
        this.dateOfFirstWarfarin= firstWithValue(values.dateOfFirstWarfarin, this.dateOfFirstWarfarin);
      }
    },
    inr: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          inrTargetRange: this.inrTargetRange,
          nextInrCheckDate: this.nextInrCheckDate,
          lastInrTest: this.lastInrTest,
        }
      },
      set(values) {
        this.inrTargetRange= firstWithValue(values.inrTargetRange, this.inrTargetRange);
        this.nextInrCheckDate= firstWithValue(values.nextInrCheckDate, this.nextInrCheckDate);
        this.lastInrTest= firstWithValue(values.lastInrTest, this.lastInrTest);
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
        this.Hb= firstWithValue(values.Hb, this.Hb);
        this.Hct= firstWithValue(values.Hct, this.Hct);
        this.Plt= firstWithValue(values.Plt, this.Plt);
        this.Bun= firstWithValue(values.Bun, this.Bun);
        this.Urea= firstWithValue(values.Urea, this.Urea);
        this.Cr= firstWithValue(values.Cr, this.Cr);
        this.Na= firstWithValue(values.Na, this.Na);
        this.K= firstWithValue(values.K, this.K);
        this.Alt= firstWithValue(values.Alt, this.Alt);
        this.Ast= firstWithValue(values.Ast, this.Ast);
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
        this.majorSurgery= firstWithValue(values.majorSurgery, this.majorSurgery);
        this.minorSurgery= firstWithValue(values.minorSurgery, this.minorSurgery);
        this.hospitalAdmission= firstWithValue(values.hospitalAdmission, this.hospitalAdmission);
        this.pastConditions= firstWithValue(values.pastConditions, this.pastConditions);
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
        this.bloodPressure= firstWithValue(values.bloodPressure, this.bloodPressure);
        this.heartBeat= firstWithValue(values.heartBeat, this.heartBeat);
        this.respiratoryRate= firstWithValue(values.respiratoryRate, this.respiratoryRate);
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
        this.EF= firstWithValue(values.EF, this.EF);
        this.LAVI= firstWithValue(values.LAVI, this.LAVI);
        this.comment= firstWithValue(values.comment, this.comment);
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
    visitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        let value = "";
        if ((this.visitYear || "") != "") {
          value += this.visitYear;
          if ((this.visitMonth || "") != "") {
            value += '/' + this.visitMonth;
            if ((this.visitDay || "") != "") {
              value += '/' + this.visitDay;
            }
          }
        }
        return {
          value: value,
          details: {
            visitDay: this.visitDay,
            visitMonth: this.visitMonth,
            visitYear: this.visitYear,
          }
        }
      },
      set(dateObj) {
        const date = typeof dateObj == 'string' ? dateObj : (dateObj || {}).value;
        let values = {};
        if (typeof date == 'string') {
          const dateParts = DatabaseNormalizer.stringToList(date, '/');
          values.visitYear = dateParts[0] || null;
          values.visitMonth = dateParts[1] || null;
          values.visitDay = dateParts[2] || null;
        }
        else if (typeof date == 'object') {
          values = date;
        }

        this.visitDay= firstWithValue(values.visitDay, this.visitDay);
        this.visitMonth= firstWithValue(values.visitMonth, this.visitMonth);
        this.visitYear= firstWithValue(values.visitYear, this.visitYear);
      }
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
    electrocardiography: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ECG",
      defaultValue: "-",
      get() {
        const rawValue = this.getDataValue('electrocardiography');
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
        this.setDataValue('electrocardiography', rawValue);
      }
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
        this.hasUsedPortableDevice= firstWithValue(values.hasUsedPortableDevice, this.hasUsedPortableDevice);
        this.dateOfLastInrTest= firstWithValue(values.dateOfLastInrTest, this.dateOfLastInrTest);
        this.lastInrValue= firstWithValue(values.lastInrValue, this.lastInrValue);
        this.lastInrTestLabInfo= firstWithValue(values.lastInrTestLabInfo, this.lastInrTestLabInfo);
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
      set(values) {
        const bloodPressureAsString = DatabaseNormalizer.listToString([values.systolic, values.diastolic], '-');
        const rawValue = `${bloodPressureAsString}`;
        this.setDataValue('bloodPressure', rawValue);
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

