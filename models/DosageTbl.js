const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return dosageTbl.init(sequelize, DataTypes);
}

class dosageTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDDosage: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IDUserPatient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PHDosage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PADosage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    DayDosage: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    MonthDosage: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    YearDosage: {
      type: DataTypes.STRING(4),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'DosageTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_DosageTbl",
        unique: true,
        fields: [
          { name: "IDDosage" },
        ]
      },
    ]
  });
  return dosageTbl;
  }
}
