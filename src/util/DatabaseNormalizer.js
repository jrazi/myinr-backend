const SimpleValidators = require("./SimpleValidators");


class DatabaseNormalizer {

    static booleanValue(str) {
        if (!SimpleValidators.hasValue(str)) return false;
        if (str.toString() == "0") return false;
        if (str.toString() == "1") return true;
        if (str.toString().length > 0) return true;
        return false;
    }

    static booleanToNumberedString(boolValue) {
        return boolValue ? "1" : "0";
    }
}


module.exports = DatabaseNormalizer;