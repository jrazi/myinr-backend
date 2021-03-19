const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return WarfarinWeekDosage.init(sequelize, DataTypes);
}

class WarfarinWeekDosage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    itemId: {
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
    },
    sunday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Sunday',
    },
    monday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Monday',
    },
    tuesday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Tuesday',
    },
    wednesday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Wednesday',
    },
    thursday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Thursday',
    },
    friday: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'Friday',
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
