

class SimpleValidators {
    static hasValue(obj) {
        if (obj == null || obj == undefined)
            return false;
        return true;
    }

    static isNumber(str) {
        return SimpleValidators.hasValue(str) && !isNaN(str);
    }

    static isNonEmptyString(str) {
        return SimpleValidators.hasValue(str) && (typeof str != 'object') && str.toString().trim() != "";
    }
}


module.exports = SimpleValidators;