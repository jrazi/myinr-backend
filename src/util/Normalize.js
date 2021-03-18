const SimpleValidators = require("./SimpleValidators");


class Normalize {

    static getFirstWithValue(elements, hasValueChecker=Normalize.hasValue) {
        if (!SimpleValidators.hasValue(elements) || !SimpleValidators.hasValue(elements.length)) return null;
        for (let element of elements) {
            if (hasValueChecker(element))
                return element;
        }
        return null;
    }

    static safelyReadNestedValue(obj, ...keys) {
        if (!SimpleValidators.hasValue(obj)) return null;

        // TODO implement
    }

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


module.exports = Normalize;