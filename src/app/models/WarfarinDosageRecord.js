const Sequelize = require('sequelize');
const JalaliDate = require("../util/JalaliDate");
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
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
    ]
  });
  return WarfarinDosageRecord;
  }
}
