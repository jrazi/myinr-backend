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
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Sex',
    },
    heartFailureHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'HeartFailure',
    },
    hypertensionHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Hypertension',
    },
    strokeHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Stroke',
    },
    Vvscular: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Vascular',
    },
    diabetes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Diabetes',
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
