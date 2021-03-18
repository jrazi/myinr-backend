const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return drugTbl.init(sequelize, DataTypes);
}

class drugTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDDrug: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DrugName: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Salt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    DosageForm: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Strengh: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RouteofAdmin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ATCCode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Ingredient: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Approvedclinicalindications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Accesslevel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true
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
  return drugTbl;
  }
}
