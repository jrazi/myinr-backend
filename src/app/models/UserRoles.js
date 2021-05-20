

module.exports = {
    admin: {
        id: 0,
        name: 'ADMIN',
    },
    physician: {
        id: 1,
        name: 'PHYSICIAN',
    },
    secretary: {
        id: 2,
        name: 'SECRETARY',
    },
    patient: {
        id: 3,
        name: 'PATIENT',
    },

    getById(id) {
        return Object.keys(this)
            .filter(key => typeof (this[key]) == 'object')
            .filter(key => (this[key] || {}).id == id)
            .map(key => this[key])[0] || null;
    }
}
