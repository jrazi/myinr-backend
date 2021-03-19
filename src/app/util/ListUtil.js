const SimpleValidators = require("./SimpleValidators");


class ListUtil {


    static isList(list) {
        if (!SimpleValidators.hasValue(list) || !SimpleValidators.hasValue(list.length))
            return false;
        return true;
    }
}


module.exports = ListUtil;