const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return firstDosageTbl.init(sequelize, DataTypes);
}

class firstDosageTbl extends Sequelize.Model {
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
    Saturday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Sunday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Monday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Tuesday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Wednesday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Thursday: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Friday: {
      type: DataTypes.STRING(10),
      allowNull: true
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
  return firstDosageTbl;
  }
}
