const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return event.init(sequelize, DataTypes);
}

class event extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eventstart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    eventend: {
      type: DataTypes.DATE,
      allowNull: false
    },
    resource: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'event',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_event",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return event;
  }
}
