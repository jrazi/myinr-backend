const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return User.init(sequelize, DataTypes);
}

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    userId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDUser',
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'RoleUser',
    },
    roleName: {
      type: DataTypes.VIRTUAL,
      get() {
        const roleNames = ['UNKNOWN', 'PHYSICIAN', 'UNKNOWN', 'PATIENT', 'UNKNOWN', 'UNKNOWN']
        return roleNames[this.role];
      },
      set(roleName) {
        throw new Error("Cannot set role name.");
      }
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'UsernameUser',
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'PasswordUser',
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      field: 'StatusUser',
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
    ],
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { exclude: [] }
    }
  });
  return User;
  }
}
