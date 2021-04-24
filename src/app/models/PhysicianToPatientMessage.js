const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PhysicianToPatientMessage.init(sequelize, DataTypes);
}

class PhysicianToPatientMessage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDPyToPt: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IDPatientPyToPt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IDPhysicianPyToPt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    YearPyToPt: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    MonthPyToPt: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    DayPyToPt: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    HourPyToPt: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    MinutePyToPt: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    Instructions: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Stopusingwarfarin: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    NextINRCheck: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Comment: {
      type: DataTypes.TEXT,
      allowNull: true
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
    FlagVisit: {
      type: DataTypes.STRING(1),
      allowNull: true
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
