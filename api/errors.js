

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


module.exports = {ApiError, AccessDenied};