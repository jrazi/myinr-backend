const Sequelize = require('sequelize');
const JalaliDate = require("../util/JalaliDate");
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const TypeChecker = require("../util/TypeChecker");
const {firstWithValue} = DatabaseNormalizer;

module.exports = (sequelize, DataTypes) => {
  return WarfarinDosageRecord.init(sequelize, DataTypes);
}

class WarfarinDosageRecord extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDDosage',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'IDUserPatient',
    },
    dosagePH: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'PHDosage',
    },
    dosagePA: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'PADosage',
    },
    dosageDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const jalali = JalaliDate.create({
          year: this.dosageYear,
          month: this.dosageMonth,
          day: this.dosageDay,
        });
        return jalali.toJson();
      },
      set(value) {
        const jalali = JalaliDate.create(value).toJson().jalali.asObject;

        this.dosageYear= firstWithValue(jalali.year, "");
        this.dosageMonth= firstWithValue(jalali.month, "");
        this.dosageDay= firstWithValue(jalali.day, "");
      }
    },
    dosageDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayDosage',
    },
    dosageMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthDosage',
    },
    dosageYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearDosage',
    }
  }, {
    sequelize,
    tableName: 'DosageTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_DosageTbl",
        unique: true,
        fields: [
          { name: "IDDosage" },
        ]
      },
    ],
    defaultScope: {
    },
    scopes: {
      lastRecordsOfPatient(patientUserId, count=7) {
        return {
          where: {
            patientUserId: patientUserId,
          },
          limit: count,
          order: [['id', 'DESC']]
        }
      }
    }
  });
  return WarfarinDosageRecord;
  }
}


WarfarinDosageRecord.assignOneWeekDosageDates = function(records, startingDate) {
  const startingJalaliDate = JalaliDate.create(startingDate || new Date());
  const dates = JalaliDate.getConsecutiveDates(startingJalaliDate, 7);

  records.forEach((record, index) => {
    record.dosageDate = dates[index].toJson().jalali.asString;
  });
  return records;
}

WarfarinDosageRecord.sortByDateASC = function (records) {
  return records.sort((r1, r2) => {
    const r1Date = JalaliDate.create(r1.dosageDate);
    const r2Date = JalaliDate.create(r2.dosageDate);
    return r1Date.compareWithJalaliDate(r2Date);
  })
}

WarfarinDosageRecord.insertPrescriptionRecords = async function(prescriptionRecords, patientUserId, startingDate, transaction) {

  if (!TypeChecker.isList(prescriptionRecords) || prescriptionRecords.length != 7)
    return null;

  const validObjectCount = prescriptionRecords.reduce((acc, current) => Number((current||{}).dosagePH) >= 0 ? acc + 1 : acc, 0);
  if (validObjectCount == 0)
    return null;

  prescriptionRecords.forEach(dosage => {
    dosage.patientUserId = patientUserId;
    dosage.dosagePA = null;
    dosage.dosagePH = dosage.dosagePH || 0;
  });

  WarfarinDosageRecord.assignOneWeekDosageDates(prescriptionRecords, startingDate);

  const insertedDosageRecords = await WarfarinDosageRecord.bulkCreate(prescriptionRecords, {
    transaction: transaction,
    returning: true,
  });

  return insertedDosageRecords;
}


WarfarinDosageRecord.getLast7DosageRecordsForPatient = async function(patientUserId, transaction=null) {
  let dosageRecords = await WarfarinDosageRecord.scope({method: ['lastRecordsOfPatient', patientUserId]}).findAll({transaction: transaction});
  WarfarinDosageRecord.sortByDateASC(dosageRecords);
  return dosageRecords;
}
