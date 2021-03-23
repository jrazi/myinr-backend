const SimpleValidators = require("./SimpleValidators");
const TypeChecker = require("./TypeChecker");


class Converter {

    static arrayOfObjectToDict(arr) {
        if (!TypeChecker.isList(arr)) return {};

        const getIdentifier = (element) => {
            if (!SimpleValidators.hasValue(element)) return null;
            if (TypeChecker.isObject(element)) {
                return element.id || element.name || element.toString();
            }
            else return element.toString();
        }

        const obj = arr.reduce((acc, current) => {
            const itemId = getIdentifier(current);
            acc[itemId] = current;
        }, {});

        return obj;
    }

}


module.exports = Converter;