const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Patient.init(sequelize, DataTypes);
}

class Patient extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    patientId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPatient',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserPatient',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'FNamePatient',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'LNamePatient',
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
      field: 'NIDPatient',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'PhonePatient',
    },
    physicianUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDPhysicianPatient',
      references: {
        model: 'Physician',
        key: 'userId',
      }
    },
    birthDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'BirthDatePatient',
    },
    prescription: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'PrescriptionPatient',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'EmailPatient',
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'Gender',
    },
    fatherName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'FatherName',
    },
    birthPlace: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'BirthPlace',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Address',
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Mobile',
    },
    emergencyPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'EssentialPhone',
    },
    secretaryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'IDSecretaryPatient',
    },
    medicalCondition: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'CausePatient',
    }
  }, {
    sequelize,
    tableName: 'PatientTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PatientTbl",
        unique: true,
        fields: [
          { name: "IDPatient" },
        ]
      },
    ]
  });
  return Patient;
  }
}
