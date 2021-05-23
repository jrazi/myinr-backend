const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Secretary.init(sequelize, DataTypes);
}

class Secretary extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDSecretary',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserSecretary',
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
      field: 'FNameSecretary',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'LNameSecretary',
    },
    nationalId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'NIDSecretary',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'PhoneSecretary',
      defaultValue: "",
      set(value) {
        this.setDataValue('phone', value || "");
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'EmailSecretary',
      defaultValue: "",
      set(value) {
        this.setDataValue('email', value || "");
      }
    },
  }, {
    sequelize,
    tableName: 'SecretaryTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Secretar__AA161EF60AD2A005",
        unique: true,
        fields: [
          { name: "IDSecretary" },
        ]
      },
    ]
  });
  return Secretary;
  }
}
