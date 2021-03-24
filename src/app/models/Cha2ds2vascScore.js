const Sequelize = require('sequelize');
const TypeChecker = require("../util/TypeChecker");
const SequelizeUtil = require("../util/SequelizeUtil");
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
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
    data: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          ageGroup: this.ageGroup,
          gender: this.gender,
          heartFailureHistory: this.heartFailureHistory,
          hypertensionHistory: this.hypertensionHistory,
          strokeHistory: this.strokeHistory,
          vascular: this.vascular,
          diabetes: this.diabetes,
        }
      },
      set(scores) {
        if (!TypeChecker.isObject(scores)) return;
        this.ageGrup = DatabaseNormalizer.firstWithValue(scores.ageGroup, this.ageGrup);
        this.gender = DatabaseNormalizer.firstWithValue(scores.gender, this.gender);
        this.heartFailureHistory = DatabaseNormalizer.firstWithValue(scores.heartFailureHistory, this.heartFailureHistory);
        this.hypertensionHistory = DatabaseNormalizer.firstWithValue(scores.hypertensionHistory, this.hypertensionHistory);
        this.strokeHistory = DatabaseNormalizer.firstWithValue(scores.strokeHistory, this.strokeHistory);
        this.vascular = DatabaseNormalizer.firstWithValue(scores.vascular, this.vascular);
        this.diabetes = DatabaseNormalizer.firstWithValue(scores.diabetes, this.diabetes);
      }
    },
    ageGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Age',
      defaultValue: 0,
    },
    gender: {
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
    vascular: {
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
    ],

  });
  return Cha2ds2vascScore;
  }
}
