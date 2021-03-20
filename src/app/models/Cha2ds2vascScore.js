const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Cha2ds2vascScore.init(sequelize, DataTypes);
}

class Cha2ds2vascScore extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PatientID',
    },
    ageGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Age',
      defaultValue: 0,
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Sex',
      defaultValue: 0,
    },
    heartFailureHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'HeartFailure',
      defaultValue: 0,
    },
    hypertensionHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Hypertension',
      defaultValue: 0,
    },
    strokeHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Stroke',
      defaultValue: 0,
    },
    Vvscular: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Vascular',
      defaultValue: 0,
    },
    diabetes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Diabetes',
      defaultValue: 0,
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
  return Cha2ds2vascScore;
  }
}
