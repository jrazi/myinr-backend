const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return flagTbl.init(sequelize, DataTypes);
}

class flagTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDFlag: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IDPatientFlag: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDPhysicianFlag: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PhTOPtFlag: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PtToPhFlag: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'flagTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_flagTbl",
        unique: true,
        fields: [
          { name: "IDFlag" },
        ]
      },
    ]
  });
  return flagTbl;
  }
}
