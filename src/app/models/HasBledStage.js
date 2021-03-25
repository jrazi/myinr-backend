const Sequelize = require('sequelize');
const SequelizeUtil = require("../util/SequelizeUtil");
const TypeChecker = require("../util/TypeChecker");
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
module.exports = (sequelize, DataTypes) => {
  return HasBledStage.init(sequelize, DataTypes);
}

class HasBledStage extends Sequelize.Model {
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
          hypertension: this.hypertension,
          renalDisease: this.renalDisease,
          liverDisease: this.liverDisease,
          strokeHistory: this.strokeHistory,
          priorBleeding: this.priorBleeding,
          labileInr: this.labileInr,
          ageGroup: this.ageGroup,
          medUsagePredisposingToBleeding: this.medUsagePredisposingToBleeding,
          alcoholOrDrugUsageHistory: this.alcoholOrDrugUsageHistory,
        }
      },
      set(scores) {
        if (!TypeChecker.isObject(scores)) return;
        this.hypertension = DatabaseNormalizer.firstWithValue(scores.hypertension, this.hypertension);
        this.renalDisease = DatabaseNormalizer.firstWithValue(scores.renalDisease, this.renalDisease);
        this.liverDisease = DatabaseNormalizer.firstWithValue(scores.liverDisease, this.liverDisease);
        this.strokeHistory = DatabaseNormalizer.firstWithValue(scores.strokeHistory, this.strokeHistory);
        this.priorBleeding = DatabaseNormalizer.firstWithValue(scores.priorBleeding, this.priorBleeding);
        this.labileInr = DatabaseNormalizer.firstWithValue(scores.labileInr, this.labileInr);
        this.ageGroup = DatabaseNormalizer.firstWithValue(scores.ageGroup, this.ageGroup);
        this.medUsagePredisposingToBleeding = DatabaseNormalizer.firstWithValue(scores.medUsagePredisposingToBleeding, this.medUsagePredisposingToBleeding);
        this.alcoholOrDrugUsageHistory = DatabaseNormalizer.firstWithValue(scores.alcoholOrDrugUsageHistory, this.alcoholOrDrugUsageHistory);
      }
    },
    hypertension: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Hypertension',
      defaultValue: 0,
    },
    renalDisease: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Renaldisease',
      defaultValue: 0,
    },
    liverDisease: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Liverdisease',
      defaultValue: 0,
    },
    strokeHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Stroke',
      defaultValue: 0,
    },
    priorBleeding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'bleeding',
      defaultValue: 0,
    },
    labileInr: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'LabileINR',
      defaultValue: 0,
    },
    ageGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Age',
      defaultValue: 0,
    },
    medUsagePredisposingToBleeding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'predisposing',
      defaultValue: 0,
    },
    alcoholOrDrugUsageHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'drug',
      defaultValue: 0,
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
    ],
  });
  return HasBledStage;
  }
}
