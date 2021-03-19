const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PatientMedicationRecord.init(sequelize, DataTypes);
}

class PatientMedicationRecord extends Sequelize.Model {
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
      field: 'IDPatient',
    },
    drugName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'Drug',
    },
    startDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Dateofstart',
    },
    endDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Dateofend',
    }
  }, {
    sequelize,
    tableName: 'PaDrTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_PaDrTbl",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  return PatientMedicationRecord;
  }
}
