const SimpleValidators = require("./SimpleValidators");
const TypeChecker = require("./TypeChecker");


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

    static stringToList(listAsString, separator=',') {
        if (!SimpleValidators.hasValue(listAsString))
            return [];
        if ((typeof listAsString !== 'string') && !(listAsString instanceof String))
            return [];
        if (listAsString.length == 0 || listAsString == '')
            return [];
        let list = listAsString.split(separator);
        return list;
    }


    static listToString(list, separator=',') {
        if (!SimpleValidators.hasValue(list))
            return "";
        if (!Array.isArray(list))
            return "";

        const valueAsString = (value) => {
            return TypeChecker.isObject(value) ? (DatabaseNormalizer.firstWithValue(value.id, "")) : (DatabaseNormalizer.firstWithValue(value, ""));
        }

        let listAsString = list.reduce((acc, currentValue) =>  acc + valueAsString(currentValue) + separator , "");
        listAsString = listAsString.substring(0, listAsString.length - 1);

        return listAsString;
    }

    static firstWithValue(...items) {
        if (items == null) return null;
        for (let item of items) {
            if (SimpleValidators.hasValue(item))
                return item;
        }
        return null;
    }
}


module.exports = DatabaseNormalizer;