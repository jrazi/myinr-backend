const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return DomainNameTable.init(sequelize, DataTypes);
}

class DomainNameTable extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDItems',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'NameItems',
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'groupItems',
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
  return DomainNameTable;
  }
}
