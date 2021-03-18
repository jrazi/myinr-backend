const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return secretaryTbl.init(sequelize, DataTypes);
}

class secretaryTbl extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDSecretary: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    FNameSecretary: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    NIDSecretary: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PhoneSecretary: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    EmailSecretary: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    IDUserSecretary: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    LNameSecretary: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
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
  return secretaryTbl;
  }
}
