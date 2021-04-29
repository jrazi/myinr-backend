const Sequelize = require('sequelize');
const JalaliTime = require("../util/JalaliTime");
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const JalaliDate = require("../util/JalaliDate");
const SequelizeUtil = require("../util/SequelizeUtil");
const {firstWithValue} = DatabaseNormalizer;

module.exports = (sequelize, DataTypes) => {
  return PhysicianToPatientMessage.init(sequelize, DataTypes);
}

class PhysicianToPatientMessage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPyToPt',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'IDPatientPyToPt',
    },
    physicianUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'IDPhysicianPyToPt',
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
        const time = JalaliTime.ofHourMin(this.messageHour, this.messageMinute).toJson();
        return time;
      },
      set(value) {
        if (!value) return;
        const time = JalaliTime.ofHourMin(value.hour, value.minute).toJson().asObject;

        this.messageHour = time.hour;
        this.messageMinute = time.minute;
      }
    },
    messageYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearPyToPt',
    },
    messageMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthPyToPt',
    },
    messageDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayPyToPt',
    },
    messageHour: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'HourPyToPt',
    },
    messageMinute: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MinutePyToPt',
    },
    physicianInstructions: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Instructions',
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('physicianInstructions');
        const conditionIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);

        return conditions;
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('physicianInstructions', rawValue);
      }

    },
    recommendedDaysWithoutWarfarin: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'Stopusingwarfarin',
      defaultValue: "",
    },
    nextInrCheckDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'NextINRCheck',
      defaultValue: "",
      get() {
        const jalali = JalaliDate.create(this.getDataValue('nextInrCheckDate'));
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asString;
        this.setDataValue('nextInrCheckDate', jalali || "");
      }
    },
    physicianComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Comment',
      defaultValue: "",
    },
    visitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.visitYear,
          month: this.visitMonth,
          day: this.visitDay,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.visitYear= firstWithValue(jalali.year, "");
        this.visitMonth= firstWithValue(jalali.month, "");
        this.visitDay= firstWithValue(jalali.day, "");
      }
    },
    visitDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayVisit',
      defaultValue: "",
    },
    visitMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthVisit',
      defaultValue: "",
    },
    visitYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearVisit',
      defaultValue: "",
    },
    visitFlag: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'FlagVisit',
      defaultValue: "1",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('visitFlag'));
      },
      set(value) {
        this.setDataValue('visitFlag', DatabaseNormalizer.booleanToNumberedString(value));
      }
    }
  }, {
    sequelize,
    tableName: 'PyToPtTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PyToPtTbl",
        unique: true,
        fields: [
          { name: "IDPyToPt" },
        ]
      },
    ]
  });
  return PhysicianToPatientMessage;
  }
}

PhysicianToPatientMessage.prototype.getApiObject = function () {
  const plainObject = this.get({plain: true});
  return SequelizeUtil.filterFields(plainObject, [
    'id',
    'patientUserId',
    'physicianUserId',
    'physicianComment',
    'messageDate',
    'messageTime',
    'nextInrCheck',
    'visitDate',
    'physicianInstructions',
    'recommendedDaysWithoutWarfarin',
    'visitFlag',
    'patientInfo',
    'physicianInfo',
  ]);
}