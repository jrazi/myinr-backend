
const Sequelize = require('sequelize');
const SimpleValidators = require("../util/SimpleValidators");

module.exports = (sequelize, DataTypes) => {
  return Admin.init(sequelize, DataTypes);
}

class Admin extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDAdmin',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserAdmin',
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const first = this.firstName == null ? "" : this.firstName;
        const second = this.lastName == null ? "" : this.lastName;
        return `${first} ${second}`;
      },
      set(value) {
        throw new Error('This value cannot be set.');
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'FNameAdmin',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'LNameAdmin',
    },
    nationalId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'NIDAdmin',
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'PhoneAdmin',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'EmailAdmin',
    },
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
  return Admin;
  }
}

