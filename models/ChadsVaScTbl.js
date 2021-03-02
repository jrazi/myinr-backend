const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return chadsVaScTbl.init(sequelize, DataTypes);
}

class chadsVaScTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    PatientID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HeartFailure: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Hypertension: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stroke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Vascular: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Diabetes: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CHADS-VAScTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_CHADS-VAScTbl",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  return chadsVaScTbl;
  }
}
