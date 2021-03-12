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

}


module.exports = Normalize;