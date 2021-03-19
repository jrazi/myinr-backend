

class SimpleValidators {
    static hasValue(obj) {
        if (obj == null || obj == undefined)
            return false;
        return true;
    }
}


module.exports = SimpleValidators;