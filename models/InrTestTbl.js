const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return inrTestTbl.init(sequelize, DataTypes);
}

class inrTestTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDINR: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NewINR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TimeofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DateofINRTest: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    UserIDPatient: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'INRTestTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_INRTestTbl",
        unique: true,
        fields: [
          { name: "IDINR" },
        ]
      },
    ]
  });
  return inrTestTbl;
  }
}
