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
        if (!SimpleValidators.hasValue(listAsString))
            return "";
        if (!Array.isArray(list))
            return "";

        let listAsString = list.reduce((acc, currentValue) => acc + currentValue + "," , "");
        listAsString = listAsString.substring(0, listAsString.length - 1);

        return listAsString;
    }
}


module.exports = DatabaseNormalizer;