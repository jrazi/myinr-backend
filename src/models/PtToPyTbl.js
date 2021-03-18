const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ptToPyTbl.init(sequelize, DataTypes);
}

class ptToPyTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDPtToPy: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IDPatientPtToPy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDPhysicianPtToPy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    INRPtToPy: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CommentPtToPy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    INRYearPtToPy: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    INRMonthPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    INRDayPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    INRHourPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    INRMinutePtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    YearPtToPy: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    MonthPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    DayPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    HourPtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    MinutePtToPy: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    Lab: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PortableDevice: {
      type: DataTypes.STRING(1),
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
    ChangeDosageDate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    HighINR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    LowINR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    BleedingorClotting: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
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
    ]
  });
  return ptToPyTbl;
  }
}
