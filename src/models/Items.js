const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return items.init(sequelize, DataTypes);
}

class items extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    IDItems: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NameItems: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    groupItems: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Items',
    schema: 'myinrir_test',
    timestamps: false,
    indexes: [
      {
        name: "PK__Items__D4E82707A4DEA185",
        unique: true,
        fields: [
          { name: "IDItems" },
        ]
      },
    ]
  });
  return items;
  }
}
