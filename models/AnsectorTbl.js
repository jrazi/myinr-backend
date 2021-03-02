const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ansectorTbl.init(sequelize, DataTypes);
}

class ansectorTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDAnsector: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NameAnsector: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    StatusAncestor: {
      type: DataTypes.INTEGER,
      allowNull: true
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
  return ansectorTbl;
  }
}
