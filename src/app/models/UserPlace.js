const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return UserPlace.init(sequelize, DataTypes);
}

class UserPlace extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPhAn',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserPhAn',
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDAncestorPhAn',
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
  return UserPlace;
  }
}
