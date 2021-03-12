const Normalize = require("./Normalize");
const SimpleValidators = require("./SimpleValidators");
const ListUtil = require("./ListUtil");

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

    static getFirstInList(list, compareFunction=(a, b) => a.id - b.id) {
        if (!ListUtil.isList(list))
            return null;
        const first = list.reduce(function(prev, current) {
            return compareFunction(prev, current) > 0 ? prev : current
        })
        return first;
    }

    static getLastInList(list, compareFunction=(a, b) => a.id - b.id) {
        if (!ListUtil.isList(list))
            return null;
        const last = list.reduce(function(prev, current) {
            return compareFunction(prev, current) <= 0 ? prev : current
        })
        return last;
    }
}

module.exports = SequelizeUtil;