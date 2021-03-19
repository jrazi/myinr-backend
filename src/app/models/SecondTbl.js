const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return secondTbl.init(sequelize, DataTypes);
}

class secondTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDSecond: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ReasonforusingWarfarin: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ProcedurePreparing: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    NewINR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Lab: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    TimeofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DateofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Hospitalized: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    ERVisit: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    BleedingorClotting: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Recommendation: {
      type: DataTypes.STRING(5),
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
    DosageToday: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    DayVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    MonthVisit: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    YearVisit: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    UserIDPatient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FlagVisit: {
      type: DataTypes.STRING(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'SecondTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_SecondTbl",
        unique: true,
        fields: [
          { name: "IDSecond" },
        ]
      },
    ]
  });
  return secondTbl;
  }
}
