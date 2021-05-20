const Sequelize = require('sequelize');
const TypeChecker = require("../util/TypeChecker");
const SimpleValidators = require("../util/SimpleValidators");
const UserRoles = require("./UserRoles");

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


User.createPatient = async function (nationalId, transaction) {
  nationalId = nationalId.replace(/\s/g,'');

  if (!SimpleValidators.isNonEmptyString(nationalId))
    throw new Error("national id is not valid");

  return await User.create(
      {
        role: UserRoles.patient.id,
        username: nationalId,
        password: '_' + nationalId,
        status: 1,
      },
      {
        transaction: transaction,
      }
  );
}