const JalaliDate = require("../../app/util/JalaliDate");


describe("jalali date constructor", () => {

    it('should have empty jdate when constructing with null', function () {
        const jDate = JalaliDate.create(null);

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with blank str', function () {
        const jDate = JalaliDate.create("");

        expect(jDate.getGeorgianDate()).toBeNull();
        expect(jDate.toJson().jalali.asString).toBeNull();
    });

    it('should have empty jdate when constructing with empty str', function () {
        const jDate = JalaliDate.create("    ");

        expect(jDate.getGeorgianDate()).toBeNull();
        expect(jDate.toJson().jalali.asString).toBeNull();
    });

    it('should have empty jdate when constructing object of blanks strings', function () {
        const jDate = JalaliDate.create({
            year: "",
            month: "",
            day: "",
        });

        expect(jDate.getGeorgianDate()).toBeNull();
        expect(jDate.toJson().jalali.asString).toBeNull();
    });

    it('should have the correct date when constructing with jalali string date', function () {
        const jDate = JalaliDate.create("1399/05/08");

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2020");
    });

    it('should have the correct date when constructing with jalali string, with a bit different format', function () {
        const jDate = JalaliDate.create("98/5/08");

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2019");
    });

    it('should have the correct date when constructing with jalali date array', function () {
        const jDate = JalaliDate.create([1400, 4, 31]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2021");
    });

    it('should have the correct date when constructing with jalali date array, with omitting two first digits of year', function () {
        const jDate = JalaliDate.create([1400, 4, 31]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2021");
    });

    it('should have the correct date when constructing with jalali date array, with omitting two first digits of year', function () {
        const jDate = JalaliDate.create([0, 12, 11]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2022");
    });

    it('should have the correct date when constructing with jalali date array, with omitting two first digits of year', function () {
        const jDate = JalaliDate.create([97, 12, 11]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2019");
    });

    it('should have the correct date when constructing with jalali date array that has string values', function () {
        const jDate = JalaliDate.create(["1401", "1", "09"]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2022");
    });

    it('should have the correct date when constructing with jalali date array that has string values', function () {
        const jDate = JalaliDate.create(["98", "3", 12]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2019");
    });


    it('should have the correct date when constructing with jalali date array, with omitting two first digits of year', function () {
        const jDate = JalaliDate.create([1400, 4, 31]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2021");
    });


    it('should have the correct date when constructing with jalali date object', function () {
        const jDate = JalaliDate.create({year: 1399, month: 12, day: 30});

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2021");
    });

    it('should have empty jdate when constructing with empty string', function () {
        const jDate = JalaliDate.create("  ");

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with empty array', function () {
        const jDate = JalaliDate.create([]);

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with empty object', function () {
        const jDate = JalaliDate.create({});

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with incomplete array', function () {
        const jDate = JalaliDate.create([1400, 2]);

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with incomplete object', function () {
        const jDate = JalaliDate.create({year: 1399, day: 11});

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with object that has a null item', function () {
        const jDate = JalaliDate.create({year: 1399, month: null, day: 11});

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with incomplete string date', function () {
        const jDate = JalaliDate.create("1396/11");

        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have empty jdate when constructing with incorrect string date', function () {
        const jDate = JalaliDate.create("1396/what/18");

        const a = jDate.getGeorgianDate();
        expect(jDate.getGeorgianDate()).toBeNull();
    });

    it('should have non-empty jdate when constructing with date that has greater than possible values', function () {
        const jDate = JalaliDate.create("1399/27/03");

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2022");
    });

    it('should have non-empty jdate when constructing with date that has greater than possible values', function () {
        const jDate = JalaliDate.create([1402, 3, 77]);

        expect(jDate.getGeorgianDate().getFullYear().toString()).toEqual("2023");
    });

    it('should have correct jdate when constructing with jdate json object', function () {
        const jDate = JalaliDate.create({
            jalali: {
                asString: "99/12/03",
                asObject: {
                    year: 99,
                    month: 12,
                    day: "3",
                },
                asArray: [99, 12, 3],
            }
        });

        expect(jDate.getJDate().getFullYear()).toEqual(1399);
    });

    it('should have correct jdate when constructing with jdate json object', function () {
        const ref = JalaliDate.create("1398/04/05");
        const jDate = JalaliDate.create(ref);


        expect(jDate.getJDate().getFullYear()).toEqual(1398);
    });
});

describe("jalali date comparison", () => {
    it('should return 1 when comparing a day later with today', function () {
        const date = new Date();
        date.setUTCMonth(date.getUTCMonth() + 2);
        const result = JalaliDate.create(date).compareWithToday();

        expect(result).toEqual(1);
    });

    it('should return -1 when comparing a day before with today', function () {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        const result = JalaliDate.create(date).compareWithToday();

        expect(result).toEqual(-1);
    });


    it('should return 0 when comparing a date today, but different hour-minute', function () {
        const date = new Date();
        const utcDay = date.getDate();
        date.setUTCMinutes(date.getUTCMinutes() - 10);
        date.setDate(utcDay);
        const result = JalaliDate.create(date).compareWithToday();

        expect(result).toEqual(0);
    });

    it('should return null when comparing a corrupt date', function () {
        const result = JalaliDate.create("here is date").compareWithToday();

        expect(result).toBeNull();
    });

});

describe("jalali date list minimum function", () => {
    it('should return minimum when comparing jalali dates with different formats', function () {
        const dateList = ["99/12/07", null, "1400/03/08", [1388, 3, 9], null, {}, {jalali: {asObject: {year: 86, month: 3, day: 3}}}, "1387/10/22", null];

        const minDateObj = JalaliDate.getMinimumDate(dateList);
        const minIndex = minDateObj.index;
        const minDate = minDateObj.date;

        expect(minIndex).toEqual(6);
        expect(minDate.toJson().jalali.asString).toEqual("1386/3/3");
    });


});


describe("jalali date consecutive dates function", () => {
    it('it should return 7 consecutive dates from the starting date onwards', function () {

        const startingDate = JalaliDate.create(new Date());

        const dates = JalaliDate.getConsecutiveDates(startingDate, 7);

        dates.forEach((date, index) => {
            if (index == 0) return;
            const curr = date;
            const prev = dates[index - 1];

            expect((curr.toJson().timestamp - prev.toJson().timestamp) > 0).toEqual(true);
        })
    });


});