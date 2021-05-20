const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const SequelizeUtil = require('../util/SequelizeUtil');
const SimpleValidators = require("../util/SimpleValidators");
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
      set(gender) {
        let genderLetter = !SimpleValidators.isNonEmptyString(gender) ? null
            : gender.toUpperCase()[0] == 'M' ? 'M' : gender.toUpperCase()[0] == 'F' ? 'F' : null;

        this.setDataValue('gender', genderLetter);
      }
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
      get() {
        const rawValue = this.getDataValue('medicalCondition');
        const conditions = DatabaseNormalizer.stringToList(rawValue, '-');

        return conditions.map(condition => {return {name: condition};})
      },
      set(conditionList) {
        const conditionNameList = (conditionList || []).map(condition => DatabaseNormalizer.firstWithValue(condition.name, ""));
        const conditionsAsString = DatabaseNormalizer.listToString(conditionNameList, '-');
        this.setDataValue('medicalCondition', conditionsAsString);
      }
    },
    firstVisitStatus: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('firstVisitStatus');
      },
      set(firstVisitInfo) {
        const status = {
          started: firstVisitInfo != null,
          flags: firstVisitInfo != null ? firstVisitInfo.flags : null,
        }
        this.setDataValue('firstVisitStatus', status);
      }
    },
    visitStatus: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('visitStatus');
      },
      set(visits) {
        visits = visits || [];
        const firstOnVisitList = SequelizeUtil.getMinOfList(visits);
        const lastOnVisitList = SequelizeUtil.getMaxOfList(visits);

        const status = {
          visitCount: visits.length,
          firstVisitDate: firstOnVisitList ? firstOnVisitList.visitDate : null,
          lastVisitDate: lastOnVisitList ? lastOnVisitList.visitDate : null,
        }
        this.setDataValue('visitStatus', status);
      }
    },
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
