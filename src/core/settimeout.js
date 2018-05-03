/**
* Set Timeout
* (c) 2013 Bill, BunKat LLC.
*
* Works similar to setTimeout() but allows you to specify a Later schedule
* instead of milliseconds.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
const moment = require('moment-timezone');

later.setTimeout = function(fn, sched, timezone) {

  if(timezone) {
    return setTimeoutWithTimezone(fn, sched, timezone);
  } else {
     return setTimeout(fn, sched);
  }

    function setTimeoutWithTimezone(fn, sched, timezone){
        var s = later.schedule(sched), t;
        if (fn) {
            scheduleTimeout();
        }

        /**
         * Schedules the timeout to occur. If the next occurrence is greater than the
         * max supported delay (2147483647 ms) than we delay for that amount before
         * attempting to schedule the timeout again.
         */
        function scheduleTimeout() {
            var now = getTimezoneDateAsIfItWasUtc(moment.tz(timezone)),
                next = s.next(2, now)
                    .map(toStringWithoutUTCIndicator);

            if (!next[0]) {
                t = undefined;
                return;
            }

            var diff = next[0].getTime() - now;

            // minimum time to fire is one second, use next occurrence instead
            if (diff < 1000) {
                diff = next[1] ? next[1].getTime() - now : 1000;
            }

            if (diff < 2147483647) {
                t = setTimeout(fn, diff, timezone);
            }
            else {
                t = setTimeout(scheduleTimeout, 2147483647, timezone);
            }
        }

        return {

            isDone: function () {
                return !t;
            },

            /**
             * Clears the timeout.
             */
            clear: function () {
                clearTimeout(t);
            }

        };

        function toStringWithoutUTCIndicator(date) {
            const isoString = date.toISOString();
            return isoString.substring(0, isoString.length - 1);
        }

        function getTimezoneDateAsIfItWasUtc(timezoneDate) {
            const formattedAsLocal = timezoneDate.format('YYYY-MM-DDTHH:mm:ss');
            const formattedAsUTC = formattedAsLocal + 'Z';
            return new Date(formattedAsUTC);
        }
    }

    function setTimeout(fn, sched){
        var s = later.schedule(sched), t;
        if (fn) {
            scheduleTimeout();
        }

        /**
         * Schedules the timeout to occur. If the next occurrence is greater than the
         * max supported delay (2147483647 ms) than we delay for that amount before
         * attempting to schedule the timeout again.
         */
        function scheduleTimeout() {
            var now = Date.now(),
                next = s.next(2, now)

            if (!next[0]) {
                t = undefined;
                return;
            }

            var diff = next[0].getTime() - now;

            // minimum time to fire is one second, use next occurrence instead
            if (diff < 1000) {
                diff = next[1] ? next[1].getTime() - now : 1000;
            }

            if (diff < 2147483647) {
                t = setTimeout(fn, diff, timezone);
            }
            else {
                t = setTimeout(scheduleTimeout, 2147483647, timezone);
            }
        }

        return {

            isDone: function () {
                return !t;
            },

            /**
             * Clears the timeout.
             */
            clear: function () {
                clearTimeout(t);
            }

        };

    }
};