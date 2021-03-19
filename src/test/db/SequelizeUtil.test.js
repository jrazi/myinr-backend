
const {getMaxOfList, getMinOfList} = require("../../app/util/SequelizeUtil");


describe("get max of list function", () => {
    it('should return null when list is null', function () {
        const max = getMaxOfList(null);

        expect(max).toBeNull();
    });
    it('should return null when list is empty', function () {
        const max = getMaxOfList([]);

        expect(max).toBeNull();

    });
    it('should return null when list consists of one null item', function () {
        const max = getMaxOfList([null]);

        expect(max).toBeNull();

    });
    it('should return max when list has several items and max is null', function () {
        const max = getMaxOfList([4, 8, null]);

        expect(max).toEqual(8);

    });
    it('should return the largest number  in a list with several numbers and strings and null', function () {
        const max = getMaxOfList([null, 9, 2, 'hi', null, 31, 18, "", 'another string']);

        expect(max).toEqual(31);

    });

    it('should return the element with largest id in a list with object elements', function () {
        const max = getMaxOfList([{id: 5, name: 'a'}, {id: 2, name: 'b'}, {id: 11, name: 'b'}, {id: 5}]);

        expect(max.id).toEqual(11);
        expect(max.name).toEqual('b');
    });

    it('should return the element with largest id in a list with object elements and strings and nulls', function () {
        const max = getMaxOfList([null, {id: 5, name: 'a'}, 'hi', {id: null, name: 'b'}, {id: 19, name: 'largest'}, null, {id: 5}]);

        expect(max.id).toEqual(19);
        expect(max.name).toEqual('largest');
    });

    it('should return the element with largest id in a list with object elements and strings and nulls and numbers, when object with id is the largest', function () {
        const max = getMaxOfList([null, {id: 5, name: 'a'}, 11, {id: null, name: 'b'}, 15, {id: 19, name: 'largest'}, null, {id: 5}]);

        expect(max.id).toEqual(19);
        expect(max.name).toEqual('largest');
    });

    it('should return the element with largest number in a list with object elements and strings and nulls and numbers, when number is the largest', function () {
        const max = getMaxOfList([null, {id: 5, name: 'a'}, 11, {id: null, name: 'b'}, 15, {id: 19, name: 'largest'}, null, {id: 5}, 100]);

        expect(max).toEqual(100);
    });
});

describe("get min of list function", () => {
    it('should return null when list is null', function () {
        const min = getMinOfList(null);

        expect(min).toBeNull();
    });
    it('should return the element with lowest id in a list with object elements and strings and nulls and numbers, when id is lowest', function () {
        const min = getMinOfList([null, {id: 5, name: 'a'}, 11, {id: 2, name: 'aa__aa'}, 15, {id: 19, name: 'something'}, null, {id: 5}, 100]);

        expect(min.id).toEqual(2);
        expect(min.name).toEqual('aa__aa');
    });
    it('should return the element with lowest id in a list with object elements and strings and nulls and numbers, when id is lowest', function () {
        const min = getMinOfList([null, {id: 5, name: 'a'}, 11, {id: 2, name: 'aa__aa'}, 15, {id: 19, name: 'something'}, 1.5, null, {id: 5}, 100]);

        expect(min).toEqual(1.5);
    });
});