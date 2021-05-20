const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Admin.init(sequelize, DataTypes);
}

class Admin extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDAdmin: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      id: 'IDAdmin',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      id: 'IDUserAdmin',
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
      id: 'FNameAdmin',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      id: 'LNameAdmin',
    },
    nationalId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      id: 'NIDAdmin',
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      id: 'PhoneAdmin',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      id: 'EmailAdmin',
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
