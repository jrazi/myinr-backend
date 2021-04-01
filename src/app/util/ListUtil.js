const SimpleValidators = require("./SimpleValidators");
const TypeChecker = require("./TypeChecker");


class ListUtil {

    static listsEqual(firstList, secondList) {
        if (firstList === secondList) return true;
        if (!SimpleValidators.hasValue(firstList) || !SimpleValidators.hasValue(secondList) || !TypeChecker.isList(firstList) || !TypeChecker.isList(secondList))
            return false;

        if (firstList.length !== secondList.length) return false;

        firstList = firstList.sort(function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        secondList = firstList.sort(function(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });

        firstList.forEach((item, index) => {
            if (secondList[index] != item) return false;
        });
        return true;
    }

}


module.exports = ListUtil;