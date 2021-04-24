
const moment = require('moment-timezone');
require('moment-timezone');

class JalaliTime {

    hour = null
    minute = null

    static now() {
        const now = moment(Date.now()).tz('Asia/Tehran');
        const [hour, min] = [now.hours(), now.minutes()]
        return new JalaliTime(hour, min);
    }

    static ofHourMin(hour, min) {
        return new JalaliTime(hour, min);
    }

    constructor(hour, minute) {
        this.hour = hour;
        this.minute = minute;
    }

    toJson() {
        const [hour, minute] = [Number(this.hour || 0), Number(this.minute || 0)];
        const hourStr = hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        const minuteStr = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

        return {
            asString: `${hourStr}:${minuteStr}`,
            asObject: {
                hour,
                minute,
            },
            asArray: [hour, minute],
        }
    }
}

module.exports = JalaliTime