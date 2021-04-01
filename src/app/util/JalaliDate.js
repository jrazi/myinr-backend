
const JDate = require('jalali-date');
const SimpleValidators = require("./SimpleValidators");
const {hasValue, isNonEmptyString, isNumber} = require("./SimpleValidators");
const SequelizeUtil = require("./SequelizeUtil");
const DatabaseNormalizer = require("./DatabaseNormalizer");
const TypeChecker = require("./TypeChecker");

class JalaliDate {

    static EmptyDate = new JalaliDate(null);
    jDate = null;

    static now() {
        return JalaliDate.withGeorgianDate(new Date());
    }

    static create(date) {
        if (!hasValue(date)) return JalaliDate.EmptyDate;
        if (date instanceof Date)
            return JalaliDate.withGeorgianDate(date);
        else if (isNonEmptyString(date))
            return JalaliDate.withJalaliStringDate(date);
        else if (typeof date == 'object')
            return JalaliDate.withJalaliDateAsObject(date);
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

        if (!hasValue(year) || !hasValue(month) || !hasValue(day)) {
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

    compareWithToday() {
        if (this.jDate == null) return null;
        const now = new Date();
        const date = new Date(this.jDate._d);

        now.setUTCHours(0, 0, 0, 0);
        date.setUTCHours(0, 0, 0, 0);
        return date > now ? 1 : (now >= date && now <= date) ? 0 : -1;
    }

    getJDate() {
        return this.jDate;
    }

    getGeorgianDate() {
        return ((this.jDate || {})._d) || null;
    }
}

module.exports = JalaliDate;