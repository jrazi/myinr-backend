const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return userTbl.init(sequelize, DataTypes);
}

class userTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDUser: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    RoleUser: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UsernameUser: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    PasswordUser: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    StatusUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'UserTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_UserTbl",
        unique: true,
        fields: [
          { name: "IDUser" },
        ]
      },
    ]
  });
  return userTbl;
  }
}
