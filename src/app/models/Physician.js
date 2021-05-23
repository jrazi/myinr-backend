const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Physician.init(sequelize, DataTypes);
}

class Physician extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    physicianId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPhysician',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'FNamePhysician',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'LNamePhysician',
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
    nationalId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'NIDPhysician',
    },
    medicalId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'MedicalIDPhysician',
      defaultValue: "",
      set(value) {
        this.setDataValue('medicalId', value || "");
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'PhonePhysician',
      defaultValue: "",
      set(value) {
        this.setDataValue('phone', value || "");
      }
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'EmailPhysician',
      defaultValue: "",
      set(value) {
        this.setDataValue('email', value || "");
      }
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'AddressPhysician',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserPhysician',
      // references: {
      //   model: 'User',
      //   key: 'userId'
      // }
    },
    expertise: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'ExpertisePhysician',
    },
    gotoSecretary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'GotoSecretary',
    }
  }, {
    sequelize,
    tableName: 'PhysicianTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Physicia__3976C6FFEB8E701A",
        unique: true,
        fields: [
          { name: "IDPhysician" },
        ]
      },
    ]
  });
  return Physician;
  }
}
