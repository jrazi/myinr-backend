const Sequelize = require('sequelize');
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
    alcaholOrDrugUsageHistory: {
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
    ]
  });
  return HasBledStage;
  }
}
