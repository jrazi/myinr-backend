const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const JalaliDate = require("../util/JalaliDate");
const {firstWithValue} = DatabaseNormalizer;

module.exports = (sequelize, DataTypes) => {
  return VisitAppointment.init(sequelize, DataTypes);
}

class VisitAppointment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDVisit',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'UserIDPatient',
    },
    expired: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create(this.scheduledVisitDate.jalali.asString);
        return !this.hasVisitHappened && jalali.isValidDate() && jalali.compareWithToday() < 0;
      },
      set() {
        return null;
      }
    },
    isScheduled: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.scheduledVisitDate.iso != null;
      },
      set() {
        return null;
      }
    },
    approximateVisitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.approximateVisitYear,
          month: this.approximateVisitMonth,
          day: this.approximateVisitDay,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.approximateVisitYear= jalali.year;
        this.approximateVisitMonth= jalali.month;
        this.approximateVisitDay= jalali.day;
      }
    },
    scheduledVisitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.visitYear,
          month: this.visitMonth,
          day: this.visitDay,
          hour: this.visitHour,
          minute: this.visitMinute,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.visitYear = jalali.year || null;
        this.visitMonth = jalali.month || null;
        this.visitDay = jalali.day || null;
        this.visitHour = jalali.hour || null;
        this.visitMinute = jalali.minute || null;
      }
    },
    hasVisitHappened: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'FlagVisit',
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hasVisitHappened'));
      },
      set(value) {
        this.setDataValue('hasVisitHappened', DatabaseNormalizer.booleanToNumberedString(value));
      }

    },
    approximateVisitYear: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'AYearVisit',
    },
    approximateVisitMonth: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'AMonthVisit',
    },
    approximateVisitDay: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'ADayVisit',
    },
    visitYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearVisit',
    },
    visitMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthVisit',
    },
    visitDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayVisit',
    },
    visitHour: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'HourVisit',
    },
    visitMinute: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MinuteVisit',
    },
  }, {
    sequelize,
    tableName: 'AppointmentTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_appointmentTbl",
        unique: true,
        fields: [
          { name: "IDVisit" },
        ]
      },
    ],
    scopes: {
      expired: {
        where: {

        }
      },
      attended: {
        where: {
          hasVisitHappened: true,
        }
      },

    },
  });
  return VisitAppointment;
  }
}

VisitAppointment.prototype.getApiObject = function () {
  const plainObject = this.get({plain: true});
  return {
    id: plainObject.id,
    patientUserId: plainObject.patientUserId,
    hasVisitHappened: plainObject.hasVisitHappened,
    expired: plainObject.expired,
    isScheduled: plainObject.isScheduled,
    approximateVisitDate: plainObject.approximateVisitDate,
    scheduledVisitDate: plainObject.scheduledVisitDate,
  }
}