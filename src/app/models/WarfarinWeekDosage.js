const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return WarfarinWeekDosage.init(sequelize, DataTypes);
}

class WarfarinWeekDosage extends Sequelize.Model {
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
    saturday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Saturday',
      defaultValue: '0',
    },
    sunday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Sunday',
      defaultValue: '0',
    },
    monday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Monday',
      defaultValue: '0',
    },
    tuesday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Tuesday',
      defaultValue: '0',
    },
    wednesday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Wednesday',
      defaultValue: '0',
    },
    thursday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Thursday',
      defaultValue: '0',
    },
    friday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Friday',
      defaultValue: '0',
    }
  }, {
    sequelize,
    tableName: 'FirstDosageTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_FirstDosageTbl",
        unique: true,
        fields: [
          { name: "IDDosage" },
        ]
      },
    ]
  });
  return WarfarinWeekDosage;
  }
}
