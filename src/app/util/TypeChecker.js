const SimpleValidators = require("./SimpleValidators");


class TypeChecker {


    static isList(list) {
        if (!SimpleValidators.hasValue(list) || !SimpleValidators.hasValue(list.length))
            return false;
        return true;
    }

    static isObject(obj) {
        return SimpleValidators.hasValue(obj) && (typeof obj === "object");
    }

    static isNumber(num) {
        return SimpleValidators.hasValue(num) && !isNaN(num);
    }
}


module.exports = TypeChecker;