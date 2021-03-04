const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Physician.init(sequelize, DataTypes);
}

class Physician extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDPhysician: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FNamePhysician: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    LNamePhysician: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    NIDPhysician: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    MedicalIDPhysician: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PhonePhysician: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    EmailPhysician: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    AddressPhysician: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    IDUserPhysician: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ExpertisePhysician: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    GotoSecretary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
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
