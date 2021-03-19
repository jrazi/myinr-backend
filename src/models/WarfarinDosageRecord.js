const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return WarfarinDosageRecord.init(sequelize, DataTypes);
}

class WarfarinDosageRecord extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDDosage',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'IDUserPatient',
    },
    dosagePH: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'PHDosage',
    },
    dosagePA: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'PADosage',
    },
    dosageDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayDosage',
    },
    dosageMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthDosage',
    },
    dosageYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearDosage',
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
  return WarfarinDosageRecord;
  }
}
