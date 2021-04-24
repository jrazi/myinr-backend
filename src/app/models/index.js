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
module.exports.PatientMedicationRecord = models.PatientMedicationRecord
module.exports.Visit = models.Visit;
module.exports.VisitAppointment = models.VisitAppointment;
module.exports.Place = models.Place;
module.exports.UserPlace = models.UserPlace;
module.exports.PatientToPhysicianMessage = models.PatientToPhysicianMessage
module.exports.PhysicianToPatientMessage = models.PhysicianToPatientMessage

module.exports.DomainNameTable = models.DomainNameTable;

module.exports.UserRoles = {
    physician: {
        id: 1,
        name: 'PHYSICIAN',
    },
    patient: {
        id: 3,
        name: 'PATIENT',
    },

    getById(id) {
        if (this.physician.id == id)
            return this.physician;
        else if (this.patient.id == id)
            return this.patient;
        return null;
    }
}
