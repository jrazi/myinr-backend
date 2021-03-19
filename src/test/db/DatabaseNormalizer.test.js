const {stringToList, listToString} = require("../../app/util/DatabaseNormalizer");

describe("string to list converter", () => {
    it('should convert null to empty list', function () {
        let list = stringToList(null, ',');
        expect(list.length).toEqual(0);
    });
    it('should convert blank to empty list', function () {
        let list = stringToList("", ',');
        expect(list.length).toEqual(0);
    });
    it('should convert string with no separator to list with one item', function () {
        let list = stringToList("33", ',');
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual("33");
    });
    it('should convert string with one item and separator and no item after that, to list with two item', function () {
        let list = stringToList("33-", '-');
        expect(list.length).toEqual(2);
        expect(list[0]).toEqual("33");
        expect(list[1]).toEqual("");
    });
    it('should convert string with only separator to a list with two empty items', function () {
        let list = stringToList("-", '-');
        expect(list.length).toEqual(2);
        expect(list[0]).toEqual("");
        expect(list[1]).toEqual("");
    });
    it('should convert string with several separated item to the corresponding list', function () {
        let list = stringToList("33-88-hi there", '-');
        expect(list.length).toEqual(3);
        expect(list[0]).toEqual("33");
        expect(list[1]).toEqual("88");
        expect(list[2]).toEqual("hi there");
    });
})

describe("list to string converter", () => {
    it('should convert null to empty string', function () {
        let listAsString = listToString(null, ',');
        expect(listAsString).toEqual("");
    });
    it('should convert wrong type(string) to empty string', function () {
        let listAsString = listToString("not a list", '-');
        expect(listAsString).toEqual("");
    });
    it('should convert wrong type(object) to empty string', function () {
        let listAsString = listToString({name: 'noList'}, ',');
        expect(listAsString).toEqual("");
    });
    it('should convert empty list to empty string', function () {
        let listAsString = listToString([], '-');
        expect(listAsString).toEqual("");
    });
    it('should convert list with two blank values to string with only separator character', function () {
        let listAsString = listToString(["", ""], '-');
        expect(listAsString).toEqual("-");
    });
    it('should convert list with two null values to string with only separator character', function () {
        let listAsString = listToString([null, null], '-');
        expect(listAsString).toEqual("-");
    });
    it('should convert list with one blank item to empty string', function () {
        let listAsString = listToString([''], ',');
        expect(listAsString).toEqual("");
    });
    it('should convert list with one null item to empty string', function () {
        let listAsString = listToString([null], '-');
        expect(listAsString).toEqual("");
    });
    it('should convert list with one item to string without any separator character', function () {
        let listAsString = listToString(["item"], ',');
        expect(listAsString).toEqual("item");
    });
    it('should convert list with one item and null to string with that item and separator character', function () {
        let listAsString = listToString(["sample", null], '-');
        expect(listAsString).toEqual("sample-");
    });
    it('should convert list with one item and blank item to string with one item and separator character', function () {
        let listAsString = listToString(["test", ""], ',');
        expect(listAsString).toEqual("test,");
    });
    it('should convert list with three items to corresponding string, with items separated by separator', function () {
        let listAsString = listToString(["a", "b", 3], '.');
        expect(listAsString).toEqual("a.b.3");
    });

})