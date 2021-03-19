
class ResponseTemplate {

    status;
    code;
    message;
    data;

    constructor () {
        this.status = 200;
        this.code = "SUCCESS";
        this.message = "";
        this.data = {};
    }

    static create() {
        return new ResponseTemplate();
    }

    withStatus(_status) {
        this.status = _status;
        return this;
    }

    withCode(_code) {
        this.code = _code;
        return this;
    }

    withMessage(_message) {
        this.message = _message;
        return this;
    }

    withData(_data) {
        this.data = _data;
        return this;
    }

    toJson() {
        return {
            status: this.status,
            code: this.code,
            message: this.message,
            data: this.data,
        }
    }
}

module.exports = ResponseTemplate;