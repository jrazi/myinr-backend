const sequelize = require('../database/db').sequelize;
const initModels = require('./init-models').initModels;

const models = initModels(sequelize);


module.exports.Physician = models.Physician;
module.exports.User = models.User;
module.exports.Patient = models.Patient;
module.exports.FirstVisit = models.FirstVisit;
module.exports.HasBledStage = models.HasBledStage;
module.exports.Cha2ds2vascScore = models.Cha2ds2vascScore;
module.exports.WarfarinWeekDosage = models.WarfarinWeekDosage;
module.exports.DrugInfo = models.DrugInfo;
module.exports.WarfarinDosageRecord = models.WarfarinDosageRecord;
module.exports.PatientMedicationRecord = models.PatientMedicationRecord;
module.exports.DomainNameTable = models.DomainNameTable;

module.exports.UserRoles = {
    physician: {
        itemId: 1,
        name: 'PHYSICIAN',
    },
    patient: {
        itemId: 3,
        name: 'PATIENT',
    },
}
