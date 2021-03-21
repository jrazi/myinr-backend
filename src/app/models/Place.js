const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Place.init(sequelize, DataTypes);
}

class Place extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDAnsector',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'NameAnsector',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'StatusAncestor',
      defaultValue: 0,
    }
  }, {
    sequelize,
    tableName: 'AnsectorTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_AnsectorTbl",
        unique: true,
        fields: [
          { name: "IDAnsector" },
        ]
      },
    ]
  });
  return Place;
  }
}
