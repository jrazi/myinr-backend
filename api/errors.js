

class ApiError extends Error {
    constructor (status, code, message) {
        super(message);
        this.status = status;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

class AccessDenied extends ApiError {
    constructor (message = "Access Denied") {
        super(403, "ACCESS_DENIED", message);
    }
}

class NotFound extends ApiError {
    constructor (message = "The item you were looking for was not found.") {
        super(400, "NOT_FOUND", message);
    }
}

class PhysicianNotFound extends ApiError {
    constructor (message = "Physician was not found.") {
        super(400, "NOT_FOUND", message);
    }
}

class PatientNotFound extends ApiError {
    constructor (message = "Patient was not found.") {
        super(400, "NOT_FOUND", message);
    }
}

class FirstVisitNotFound extends ApiError {
    constructor (message = "No first visit was found for this patient.") {
        super(400, "NOT_FOUND", message);
    }
}


module.exports = {ApiError, AccessDenied, NotFound, PatientNotFound, FirstVisitNotFound, PhysicianNotFound};