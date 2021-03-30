const Sequelize = require('sequelize');
const DatabaseNormalizer = require("../util/DatabaseNormalizer");
const {firstWithValue} = DatabaseNormalizer;

module.exports = (sequelize, DataTypes) => {
  return Visit.init(sequelize, DataTypes);
}

class Visit extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDSecond',
    },
    patientUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'UserIDPatient',
    },
    reasonForVisit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'ReasonforusingWarfarin',
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('ReasonforusingWarfarin');
        const conditionIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);

        return conditions;
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('ReasonforusingWarfarin', rawValue);
      }

    },
    inr: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          nextInrCheckDate: this.nextInrCheckDate,
          lastInrTest: this.lastInrTest,
        }
      },
      set(values) {
        this.nextInrCheckDate= firstWithValue(values.nextInrCheckDate, this.nextInrCheckDate);
        this.lastInrTest= firstWithValue(values.lastInrTest, this.lastInrTest);
      }
    },
    lastInrTest: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          hasUsedPortableDevice: this.hasUsedPortableDevice,
          dateOfLastInrTest: this.dateOfLastInrTest,
          timeOfLastInrTest: this.timeOfLastInrTest,
          lastInrValue: this.lastInrValue,
          lastInrTestLabInfo: this.lastInrTestLabInfo,
        }
      },
      set(values) {
        this.hasUsedPortableDevice= firstWithValue(values.hasUsedPortableDevice, this.hasUsedPortableDevice);
        this.dateOfLastInrTest= firstWithValue(values.dateOfLastInrTest, this.dateOfLastInrTest);
        this.timeOfLastInrTest= firstWithValue(values.timeOfLastInrTest, this.timeOfLastInrTest);
        this.lastInrValue= firstWithValue(values.lastInrValue, this.lastInrValue);
        this.lastInrTestLabInfo= firstWithValue(values.lastInrTestLabInfo, this.lastInrTestLabInfo);
      }
    },
    procedurePreparing: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'ProcedurePreparing',
      defaultValue: "",
    },
    lastInrValue: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'NewINR',
      defaultValue: "",
    },
    lastInrTestLabInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Lab',
      defaultValue: "",
    },
    hasUsedPortableDevice: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'PortableDevice',
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hasUsedPortableDevice'));
      },
      set(value) {
        this.setDataValue('hasUsedPortableDevice', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    timeOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'TimeofINRTest',
      defaultValue: "",
    },
    dateOfLastInrTest: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'DateofINRTest',
      defaultValue: "",
    },
    wasHospitalized: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'Hospitalized',
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('wasHospitalized'));
      },
      set(value) {
        this.setDataValue('wasHospitalized', DatabaseNormalizer.booleanToNumberedString(value));
      }
    },
    hadERVisit: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'ERVisit',
      defaultValue: "0",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hadERVisit'));
      },
      set(value) {
        this.setDataValue('hadERVisit', DatabaseNormalizer.booleanToNumberedString(value));
      }

    },
    bleedingOrClottingTypes: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'BleedingorClotting',
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('bleedingOrClottingTypes');
        const conditionIds = DatabaseNormalizer.stringToList(rawValue, ',');

        const conditions = conditionIds.map(id => DomainNameTable[id]);

        return conditions;
      },
      set(conditionIdList) {
        const conditionsAsString = DatabaseNormalizer.listToString(conditionIdList, ',');
        const rawValue = `${conditionsAsString}`;
        this.setDataValue('bleedingOrClottingTypes', rawValue);
      }
    },
    recommendationForFuture: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'Recommendation',
      defaultValue: "",
      get() {
        const rawValue = this.getDataValue('recommendationForFuture');
        return DomainNameTable[rawValue] || null;
      },
      set(value) {
        this.setDataValue('recommendationForFuture', DatabaseNormalizer.firstWithValue((value || {}).id, null));
      }

    },
    recommendedDaysWithoutWarfarin: {
      type: DataTypes.STRING(5),
      allowNull: true,
      field: 'Stopusingwarfarin',
      defaultValue: "",
    },
    nextInrCheckDate: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'NextINRCheck',
      defaultValue: "",
    },
    reportComment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'Comment',
      defaultValue: "",
    },
    hasTakenWarfarinToday: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'DosageToday',
      defaultValue: "",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('hasTakenWarfarinToday'));
      },
      set(value) {
        this.setDataValue('hasTakenWarfarinToday', DatabaseNormalizer.booleanToNumberedString(value));
      }

    },
    visitDate: {
      type: DataTypes.VIRTUAL,
      get() {
        let value = "";
        if ((this.visitYear || "") != "") {
          value += this.visitYear;
          if ((this.visitMonth || "") != "") {
            value += '/' + this.visitMonth;
            if ((this.visitDay || "") != "") {
              value += '/' + this.visitDay;
            }
          }
        }
        return {
          value: value,
          details: {
            visitDay: this.visitDay,
            visitMonth: this.visitMonth,
            visitYear: this.visitYear,
          }
        }
      },
    },
    visitDay: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'DayVisit',
      defaultValue: "",
    },
    visitMonth: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'MonthVisit',
      defaultValue: "",
    },
    visitYear: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'YearVisit',
      defaultValue: "",
    },
    visitFlag: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'FlagVisit',
      defaultValue: "1",
      get() {
        return DatabaseNormalizer.booleanValue(this.getDataValue('visitFlag'));
      },
      set(value) {
        this.setDataValue('visitFlag', DatabaseNormalizer.booleanToNumberedString(value));
      }

    }
  }, {
    sequelize,
    tableName: 'SecondTbl',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK_SecondTbl",
        unique: true,
        fields: [
          { name: "IDSecond" },
        ]
      },
    ]
  });
  return Visit;
  }
}
