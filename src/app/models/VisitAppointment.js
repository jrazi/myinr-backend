const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
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
    approximateVisitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          year: this.approximateVisitYear,
          month: this.approximateVisitMonth,
          day: this.approximateVisitDay,
        }
      },
      set(values) {
        this.year= firstWithValue(values.year, this.approximateVisitYear);
        this.month= firstWithValue(values.month, this.approximateVisitMonth);
        this.day= firstWithValue(values.day, this.approximateVisitDay);
      }
    },
    scheduleVisitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          year: this.visitYear,
          month: this.visitMonth,
          day: this.visitDay,
          hour: this.visitHour,
          minute: this.visitMinute,
        }
      },
      set(values) {
        this.year= firstWithValue(values.year, this.visitYear);
        this.month= firstWithValue(values.month, this.visitMonth);
        this.day= firstWithValue(values.day, this.visitDay);
        this.hour= firstWithValue(values.hour, this.visitHour);
        this.minute= firstWithValue(values.minute, this.visitMinute);
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
    ]
  });
  return VisitAppointment;
  }
}
