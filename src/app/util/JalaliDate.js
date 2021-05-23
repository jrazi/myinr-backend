
const JDate = require('jalali-date');
const SimpleValidators = require("./SimpleValidators");
const {hasValue, isNonEmptyString, isNumber} = require("./SimpleValidators");
const SequelizeUtil = require("./SequelizeUtil");
const DatabaseNormalizer = require("./DatabaseNormalizer");
const TypeChecker = require("./TypeChecker");
const moment = require('moment-timezone');
require('moment-timezone');

class JalaliDate {

    static EmptyDate = new JalaliDate(null);
    jDate = null;
    time = {
        hour: 0,
        minute: 0,
    }

    static getConsecutiveDates(startDate, numOfDates) {
        const dates = [startDate,];
        for (let i = 0; i < numOfDates-1; i++)
            dates.push(dates[i].incrementDay());
        return dates;
    }

    static sortDates(jalaliDateList) {
        return (jalaliDateList || [])
            .sort((first, second) => first.compareWithJalaliDate(second));
    }

    static getMinimumDate(jalaliDateList) {
        if (!TypeChecker.isList(jalaliDateList) || jalaliDateList.length == 0)
            return null;

        let minDate = JalaliDate.create(jalaliDateList[0]);
        let minIndex = 0;
        jalaliDateList.forEach((dateItem, index) => {
            const jDateItem = JalaliDate.create(dateItem);
            if (jDateItem.isValidDate() && jDateItem.compareWithJalaliDate(minDate) <= 0) {
                minDate = jDateItem;
                minIndex = index;
            }
        })
        return {index: minIndex, date: minDate};
    }

    static now() {
        return JalaliDate.withGeorgianDate(new Date());
    }

    static create(date) {
        if (!hasValue(date)) return JalaliDate.EmptyDate;
        else if (date instanceof JalaliDate)
            return JalaliDate.withGeorgianDate(date.getGeorgianDate());
        else if (date instanceof Date)
            return JalaliDate.withGeorgianDate(date);
        else if (isNonEmptyString(date))
            return JalaliDate.withJalaliStringDate(date);
        else if (typeof date == 'object') {
            if (hasValue(date.jalali) && hasValue(date.jalali.asString))
                return JalaliDate.withJalaliStringDate(date.jalali.asString);
            else if (hasValue(date.jalali) && hasValue(date.jalali.asObject))
                return JalaliDate.withJalaliDateAsObject(date.jalali.asObject);
            else return JalaliDate.withJalaliDateAsObject(date);
        }
        else return JalaliDate.EmptyDate;
    }

    static withGeorgianDate(date) {
        if (!SimpleValidators.hasValue(date)) return new JalaliDate(null);
        return new JalaliDate(new JDate(date));
    }

    static withJalaliStringDate(date) {
        const separator = date.includes('/') ? '/'
            : date.includes(',') ? ','
            : date.includes('-') ? '-' 
            : null;

        if (separator == null) return JalaliDate.EmptyDate;
        const dateParams = DatabaseNormalizer.stringToList(date, '/');
        return JalaliDate.withJalaliDateAsObject(dateParams);
    }

    static withJalaliDateAsObject(date) {

        let [year, month, day] = [];
        if (TypeChecker.isList(date)) {
            [year, month, day] = date;
        }

        else if (TypeChecker.isObject(date)) {
            year = date.year;
            month = date.month;
            day = date.day;
        }

        else return new JalaliDate(null);

        if (!isNonEmptyString(year) || !isNonEmptyString(month) || !isNonEmptyString(day)) {
            return new JalaliDate(null);
        }

        year = Number(year);
        month = Number(month);
        day = Number(day);

        if (!isNumber(year) || !isNumber(month) || !isNumber(day)) {
            return new JalaliDate(null);
        }

        else {
            if (year < 100 && year > 20) {
                year += 1300;
            }
            else if (year <= 20) {
                year += 1400;
            }

            return new JalaliDate(new JDate(year, month, day));
        }
    }

    constructor(jDate) {
        const georgian = ((jDate || {})._d) || null;
        if (georgian == null)
            this.jDate = jDate;
        else {
            if (isNaN(georgian) || isNaN(georgian.getTime()))
                this.jDate = null;
            else this.jDate = jDate;
        }
    }

    incrementDay() {
        const thisMoment = moment(this.getGeorgianDate().getTime());
        const nextDay = thisMoment.add(1, 'days');
        return JalaliDate.create(nextDay.toDate());
    }

    compareWithToday() {
        if (this.jDate == null) return null;
        const date = new Date(this.jDate._d);

        const today = moment.tz('Asia/Tehran').startOf('day').utc();
        const toCompareDate = moment(date.getTime()).tz('Asia/Tehran').startOf('day').utc();

        return toCompareDate.isSame(today) ? 0 : toCompareDate.isSameOrAfter(today) ? 1 : -1;
    }

    compareWithJalaliDate(jalaliDate) {
        if (this.jDate == null || !(jalaliDate instanceof JalaliDate) || !jalaliDate.isValidDate()) return null;

        const date = new Date(this.jDate._d);
        const toCompareDate = new Date(jalaliDate.getGeorgianDate());

        const d1 = moment(date.getTime()).tz('Asia/Tehran').startOf('day').utc();
        const d2 = moment(toCompareDate.getTime()).tz('Asia/Tehran').startOf('day').utc();

        return d1.isSame(d2) ? 0 : d1.isSameOrAfter(d2) ? 1 : -1;
    }

    getJDate() {
        return this.jDate;
    }

    getGeorgianDate() {
        return ((this.jDate || {})._d) || null;
    }

    isValidDate() {
        return this.jDate != null;
    }

    toJson() {
        const isValidDate = this.jDate != null;
        const jalaliDateArray = !isValidDate ? null : [this.jDate.getFullYear(), this.jDate.getMonth(), this.jDate.getDate()];
        return {
            timestamp: this.getGeorgianDate() == null ? null : this.getGeorgianDate().getTime(),
            iso: this.getGeorgianDate() == null ? null : this.getGeorgianDate().toString(),
            jalali: {
                asString: !isValidDate ? null : DatabaseNormalizer.listToString(jalaliDateArray, '/'),
                asArray: !isValidDate ? [] : jalaliDateArray,
                asObject: {
                    year: !isValidDate ? null : jalaliDateArray[0],
                    month: !isValidDate ? null : jalaliDateArray[1],
                    day: !isValidDate ? null : jalaliDateArray[2],
                }
            }
        }
    }
}

module.exports = JalaliDate;