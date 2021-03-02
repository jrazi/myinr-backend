const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return hasBledTbl.init(sequelize, DataTypes);
}

class hasBledTbl extends Sequelize.Model {
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
    Hypertension: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Renaldisease: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Liverdisease: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stroke: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bleeding: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LabileINR: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    predisposing: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    drug: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'HAS-BLEDTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_HAS-BLEDTbl",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  return hasBledTbl;
  }
}
