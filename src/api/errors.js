

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

class UserNotFound extends ApiError {
    constructor (message = "User was not found.") {
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

class UsernamePasswordMismatch extends ApiError {
    constructor (message = "No user with this combination of username and password was found.") {
        super(400, "USERNAME_PASSWORD_MISMATCH", message);
    }
}

class UnauthorizedAccess extends ApiError {
    constructor (message = "The request is not authorized.") {
        super(401, "UNAUTHORIZED", message);
    }
}

class AccessForbidden extends ApiError {
    constructor (message = "You are not authorized to access this endpoint.") {
        super(403, "ACCESS_FORBIDDEN", message);
    }
}

class QueryParameterMissing extends ApiError {
    constructor (message = "Missing query parameter(s).") {
        super(400, "QUERY_PARAM_MISSING", message);
    }
}

module.exports = {
    ApiError,
    AccessDenied,
    NotFound,
    PatientNotFound,
    FirstVisitNotFound,
    PhysicianNotFound,
    UserNotFound,
    UsernamePasswordMismatch,
    QueryParameterMissing,
    UnauthorizedAccess,
    AccessForbidden,
};