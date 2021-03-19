const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return PhAnTbl.init(sequelize, DataTypes);
}

class PhAnTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDPhAn: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    IDUserPhAn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDAncestorPhAn: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PhAnTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PhAnTbl",
        unique: true,
        fields: [
          { name: "IDPhAn" },
        ]
      },
    ]
  });
  return PhAnTbl;
  }
}
