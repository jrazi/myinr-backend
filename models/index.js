const sequelize = require('../db').sequelize;
const initModels = require('./init-models').initModels;

const models = initModels(sequelize);


module.exports.Physician = models.Physician;
module.exports.User = models.User;
module.exports.Patient = models.Patient;
module.exports.FirstVisit = models.FirstVisit;
module.exports.HasBledStage = models.HasBledStage;
module.exports.Cha2ds2vascScore = models.Cha2ds2vascScore;
module.exports.FirstWarfarinDosage = models.FirstWarfarinDosage;

module.exports.UserRoles = {
    physician: {
        id: 1,
        name: 'PHYSICIAN',
    },
    patient: {
        id: 3,
        name: 'PATIENT',
    },
}
