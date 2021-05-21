const Sequelize = require('sequelize');
const TypeChecker = require("../util/TypeChecker");
module.exports = (sequelize, DataTypes) => {
  return UserPlace.init(sequelize, DataTypes);
}

class UserPlace extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'IDPhAn',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDUserPhAn',
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'IDAncestorPhAn',
    }
  }, {
    sequelize,
    tableName: 'PhAnTbl',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PhAnTbl",
        unique: true,
        fields: [
          { name: "IDPhAn" },
        ]
      },
    ]
  });
  return UserPlace;
  }
}

UserPlace.createPlace = async function (userId, placeId, transaction) {
  if (!TypeChecker.isNumber(placeId))
    throw new Error("placeId is not valid");

  else if (!TypeChecker.isNumber(userId))
    throw new Error("userId is not valid");

  return await UserPlace.create(
      {
        userId: userId,
        placeId: placeId,
      },
      {
        transaction: transaction,
      }
  );
}

UserPlace.getSharedWorkPlaces = async function (userA, userB) {
  const workPlacesA = (userA || {}).workPlaces || [];
  const workPlacesB = (userB || {}).workPlaces || [];

  const userASharedWorkPlaces = workPlacesA.filter(workPlaceA => workPlacesB.some(workPlaceB => workPalceA.placeId == workPlaceB.placeId)) || [];
  const userBSharedWorkPlaces = workPlacesB.filter(workPlaceB => workPlacesA.some(workPlaceA => workPlaceB.placeId == workPlaceA.placeId)) || [];

  return[userASharedWorkPlaces, userBSharedWorkPlaces];

}
