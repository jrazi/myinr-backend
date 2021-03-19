const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return appointmentTbl.init(sequelize, DataTypes);
}

class appointmentTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDVisit: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserIDPatient: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AYearVisit: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    AMonthVisit: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    ADayVisit: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    YearVisit: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    MonthVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    DayVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    HourVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    MinuteVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    FlagVisit: {
      type: DataTypes.STRING(1),
      allowNull: true
    }
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
  return appointmentTbl;
  }
}
