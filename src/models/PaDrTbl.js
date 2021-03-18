const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return paDrTbl.init(sequelize, DataTypes);
}

class paDrTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Drug: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    IDPatient: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Dateofstart: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Dateofend: {
      type: DataTypes.STRING(50),
      allowNull: true
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
  return paDrTbl;
  }
}
