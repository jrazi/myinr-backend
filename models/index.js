const sequelize = require('../db').sequelize;
const initModels = require('./init-models').initModels;

const models = initModels(sequelize);


module.exports.Physician = models.Physician;