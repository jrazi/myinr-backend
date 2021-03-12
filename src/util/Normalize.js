

class Normalize {

    static hasValue(obj) {
        if (obj == null || obj == undefined)
            return false;
        return true;
    }

    static getFirstWithValue(elements, hasValueChecker=Normalize.hasValue) {
        if (!Normalize.hasValue(elements) || !Normalize.hasValue(elements.length)) return null;
        for (let element of elements) {
            if (hasValueChecker(element))
                return element;
        }
        return null;
    }

}


module.exports = Normalize;