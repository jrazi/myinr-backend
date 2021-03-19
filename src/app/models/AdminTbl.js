const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return adminTbl.init(sequelize, DataTypes);
}

class adminTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDAdmin: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FNameAdmin: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    NIDAdmin: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PhoneAdmin: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    EmailAdmin: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    IDUserAdmin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LNameAdmin: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'AdminTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_AdminTbl",
        unique: true,
        fields: [
          { name: "IDAdmin" },
        ]
      },
    ]
  });
  return adminTbl;
  }
}
