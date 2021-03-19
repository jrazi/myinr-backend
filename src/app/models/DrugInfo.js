const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return DrugInfo.init(sequelize, DataTypes);
}

class DrugInfo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    itemId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDDrug',
    },
    drugName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'DrugName',
    },
    salt: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Salt',
    },
    dosageForm: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'DosageForm',
    },
    strengh: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'Strengh',
    },
    routeofAdminstration: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'RouteofAdmin',
    },
    atcCode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ATCCode',
    },
    ingredient: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Ingredient',
    },
    approvedClinicalConditions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Approvedclinicalindications',
    },
    accesslevel: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Accesslevel',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Remarks',
    }
  }, {
    sequelize,
    tableName: 'DrugTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_DrugTbl",
        unique: true,
        fields: [
          { name: "IDDrug" },
        ]
      },
    ]
  });
  return DrugInfo;
  }
}
