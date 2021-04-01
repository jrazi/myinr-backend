const SimpleValidators = require("./SimpleValidators");


class Normalize {

    static safelyReadNestedValue(obj, ...keys) {
        if (!SimpleValidators.hasValue(obj)) return null;

        // TODO implement
    }


}


module.exports = Normalize;