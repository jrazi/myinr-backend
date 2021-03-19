const Normalize = require("./Normalize");
const SimpleValidators = require("./SimpleValidators");
const TypeChecker = require("./TypeChecker");

class SequelizeUtil {

    static filterFields(obj, include) {
        if (!SimpleValidators.hasValue(obj))
            return null;
        const finalObject = {};
        for (const key in obj) {
            if (include.includes(key)) {
                finalObject[key] = obj[key];
            }
        }
        return finalObject;
    }

    static excludeFields(obj, exclude) {
        if (!SimpleValidators.hasValue(obj))
            return null;
        const finalObject = {};
        for (const key in obj) {
            if (!exclude.includes(key)) {
                finalObject[key] = obj[key];
            }
        }
        return finalObject;
    }

    static getMinOfList(list) {
        return SequelizeUtil.extractEst(list, (a, b) => b - a)
    }

    static getMaxOfList(list) {
        return SequelizeUtil.extractEst(list, (a, b) => a - b)
    }


    static extractEst(list, compareFunction) {
        if (!TypeChecker.isList(list))
            return null;
        if (list.length == 0) return null;

        const getIdentifier = (element) => {
            if (!SimpleValidators.hasValue(element)) return null;
            if (TypeChecker.isNumber(element))
                return Number(element);
            if (TypeChecker.isObject(element)) {
                if (TypeChecker.isNumber(element.id))
                    return Number(element.id);
            }
            else return null;
        }
        const last = list.reduce(function(prev, current) {
            const prevValue = getIdentifier(prev);
            const currentValue = getIdentifier(current);

            if (!SimpleValidators.hasValue(currentValue)) return prev;
            if (!SimpleValidators.hasValue(prevValue)) return current;

            return compareFunction(prevValue, currentValue) > 0 ? prev : current
        }, list[0])
        return last;
    }
}

module.exports = SequelizeUtil;