const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return HasBledStage.init(sequelize, DataTypes);
}

class HasBledStage extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    itemId: {
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
    },
    renalDisease: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Renaldisease',
    },
    liverDisease: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Liverdisease',
    },
    strokeHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Stroke',
    },
    priorBleeding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'bleeding',
    },
    labileInr: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'LabileINR',
    },
    oldAgeGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'Age',
    },
    medUsagePredisposingToBleeding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'predisposing',
    },
    alcaholOrDrugUsageHistory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'drug',
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
