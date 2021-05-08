const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const JalaliDate = require("../util/JalaliDate");
const DomainNameTable = require("./StaticDomainNameTable");
const SequelizeUtil = require("../util/SequelizeUtil");
const {firstWithValue} = DatabaseNormalizer;

module.exports = (sequelize, DataTypes) => {
  return PatientToPhysicianMessage.init(sequelize, DataTypes);
}

class PatientToPhysicianMessage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPtToPy',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDPatientPtToPy',
    },
    physicianUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDPhysicianPtToPy',
    },
    meta: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          fromPatient: true,
          toPhysician: true, 
          fromPhysician: false,
          toPatient: false,
        }
      },
      set(values) {
        return;
      }
    },
    inr: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          inrTargetRange: this.inrTargetRange,
          lastInrTest: this.lastInrTest,
        }
      },
      set(values) {
        this.inrTargetRange= firstWithValue(values.inrTargetRange, this.inrTargetRange);
        this.lastInrTest= firstWithValue(values.lastInrTest, this.lastInrTest);
      }
    },
    messageDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.messageYear,
          month: this.messageMonth,
          day: this.messageDay,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.messageYear = jalali.year || null;
        this.messageMonth = jalali.month || null;
        this.messageDay = jalali.day || null;
      }
    },
    messageTime: {
      type: DataTypes.VIRTUAL,
      get() {
        const [hour, minute] = [Number(this.messageHour || 0), Number(this.messageMinute || 0)];
        const hourStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const minuteStr = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const time = {
          asString: `${hourStr}:${minuteStr}`,
          asObject: {
            hour,
            minute,
          },
          asArray: [hour, minute],
        };
        return time;
      },
      set(value) {
        if (!value) return;
        const [hour, minute] = [Number(value.hour || 0), Number(value.minute || 0)];

        const hourStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const minuteStr = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

        this.messageHour = hourStr;
        this.messageMinute = minuteStr;
      }
    },
    patientComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'CommentPtToPy',
    },
    bloodPressure: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'BloodPressure',
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
      field: 'PulseRate',
      defaultValue: "",
    },
    dosageChangeDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'ChangeDosageDate',
      defaultValue: "",
      get() {
        const jalali = JalaliDate.create(this.getDataValue('dosageChangeDate') || null);
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asString;
        this.setDataValue('dosageChangeDate', jalali || "");
      }
    },
    inrTargetRange: {
      type: DataTypes.VIRTUAL,
      get() {
        const [from, to] = [firstWithValue(this.inrTargetFloor, null), firstWithValue(this.inrTargetCeiling, null)];
        return {from, to};
      },
      set(inrTarget) {
        this.inrTargetFloor = firstWithValue(inrTarget.from, null)
        this.inrTargetCeiling = firstWithValue(inrTarget.to, null)
      }
    },
    bleedingOrClottingTypes: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'BleedingorClotting',
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

    inrTargetCeiling: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'HighINR',
    },
    inrTargetFloor: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'LowINR',
    },
    lastInrTest: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          hasUsedPortableDevice: this.hasUsedPortableDevice,
          dateOfLastInrTest: this.dateOfLastInrTest,
          timeOfLastInrTest: this.timeOfLastInrTest,
          lastInrValue: this.lastInrValue,
          lastInrTestLabInfo: this.lastInrTestLabInfo,
        }
      },
      set(values) {
        this.hasUsedPortableDevice= firstWithValue(values.hasUsedPortableDevice, this.hasUsedPortableDevice);
        this.dateOfLastInrTest= firstWithValue(values.dateOfLastInrTest, this.dateOfLastInrTest);
        this.timeOfLastInrTest= firstWithValue(values.timeOfLastInrTest, this.timeOfLastInrTest);
        this.lastInrValue= firstWithValue(values.lastInrValue, this.lastInrValue);
        this.lastInrTestLabInfo= firstWithValue(values.lastInrTestLabInfo, this.lastInrTestLabInfo);
      }
    },
    dateOfLastInrTest: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.lastIntTestYear,
          month: this.lastInrTestMonth,
          day: this.lastInrTestDay,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.lastIntTestYear = jalali.year;
        this.lastInrTestMonth = jalali.month;
        this.lastInrTestDay = jalali.day;
      }
    },
    timeOfLastInrTest: {
      type: DataTypes.VIRTUAL,
      get() {
        const [hour, minute] = [Number(this.lastInrTestHour || 0), Number(this.lastInrTestMinute || 0)];
        const hourStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const minuteStr = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const time = {
          asString: `${hourStr}:${minuteStr}`,
          asObject: {
            hour,
            minute,
          },
          asArray: [hour, minute],
        };
        return time;
      },
      set(value) {
        if (!value) return;
        const [hour, minute] = [Number(value.hour || 0), Number(value.minute || 0)];

        const hourStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const minuteStr = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

        this.lastInrTestHour = hourStr;
        this.lastInrTestMinute = minuteStr;
      }
    },
    lastInrValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'INRPtToPy',
    },
    lastIntTestYear: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'INRYearPtToPy',
      defaultValue: "",
    },
    lastInrTestMonth: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'INRMonthPtToPy',
      defaultValue: "",
    },
    lastInrTestDay: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'INRDayPtToPy',
      defaultValue: "",
    },
    lastInrTestHour: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'INRHourPtToPy',
      defaultValue: "",
    },
    lastInrTestMinute: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'INRMinutePtToPy',
      defaultValue: "",
    },
    messageYear: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'YearPtToPy',
    },
    messageMonth: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'MonthPtToPy',
    },
    messageDay: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'DayPtToPy',
    },
    messageHour: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'HourPtToPy',
    },
    messageMinute: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'MinutePtToPy',
    },
    lastInrTestLabInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Lab',
    },
    hasUsedPortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'PortableDevice',
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hasUsedPortableDevice'));
      },
      set(value) {
        this.setDataValue('hasUsedPortableDevice', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
  }, {
    sequelize,
    tableName: 'PtToPyTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PtToPyTbl",
        unique: true,
        fields: [
          { name: "IDPtToPy" },
        ]
      },
    ],
    defaultScope: {
    },
    scopes: {
      lastMessageFromPatient(patientUserId, physicianUserId) {
        return {
          where: {
            patientUserId: patientUserId,
            physicianUserId: physicianUserId,
          },
          limit: 1,
          order: [['id', 'DESC']]
        }
      }
    }

  });
  return PatientToPhysicianMessage;
  }
}

PatientToPhysicianMessage.getLastMessageFromPatient = async function(patientUserId, physicianUserId, transaction) {
  let lastMessage = await PatientToPhysicianMessage.scope({method: ['lastMessageFromPatient', patientUserId, physicianUserId]}).findOne({transaction: transaction});
  return lastMessage;
}

PatientToPhysicianMessage.prototype.getApiObject = function () {
  const plainObject = this.get({plain: true});
  return SequelizeUtil.filterFields(plainObject, [
      'id',
      'patientUserId',
      'physicianUserId',
      'meta',
      'patientComment',
      'inr',
      'messageDate',
      'messageTime',
      'bloodPressure',
      'heartBeat',
      'bleedingOrClottingTypes',
      'dosageChangeDate',
      'patientInfo',
      'physicianInfo',
  ]);
}