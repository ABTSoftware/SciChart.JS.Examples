import { TDateTzConverterFn } from './timezones';
import { dateTickDeltas } from './EDateTickDelta';
import { NumberRange } from 'scichart/Core/NumberRange';

const toYear = (unixTimestamp: number): string => {
    // We add 2 days (2 * 86400) offset to show correctly for a leap year and different timezones
    const date = new Date((unixTimestamp + 86400) * 1000);
    const year = date.getUTCFullYear();
    if (isNaN(year)) return '';
    return year.toString(10);
};

const toMonth = (unixTimestamp: number, locale = 'en'): string => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString(locale, {
        timeZone: 'utc',
        month: 'short',
        year: '2-digit'
    });
};

const toDay = (unixTimestamp: number, locale = 'en'): string => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString(locale, {
        timeZone: 'utc',
        month: 'short',
        day: '2-digit'
    });
};

/**
 * Example of custom formatting for different locales
 * @param unixTimestamp
 * @param locale
 */
const toDayCustom = (unixTimestamp: number, locale = 'en'): string => {
    const getStrDay = (day: number) => (day <= 9 ? `0${day.toString()}` : day.toString());
    const getStrMonth = (month: number) => (month <= 9 ? `0${month.toString()}` : month.toString());

    const date = new Date(unixTimestamp * 1000);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
    // Localization
    switch (locale) {
        case 'en':
            return `${month}/${day}`;
        case 'de-DE':
            return `${getStrDay(day)}.${getStrMonth(month)}.${year % 100}`;
        case 'es-ES':
            return `${getStrDay(day)}/${getStrMonth(month)}`;
        case 'fr-CA':
            return `${getStrMonth(month)}-${getStrDay(day)}`;
        case 'fr-FR':
            return `${getStrDay(day)}/${getStrMonth(month)}`;
        case 'ja':
            return `${getStrMonth(month)}/${getStrDay(day)}`;
        case 'ko':
            return `${getStrMonth(month)}-${getStrDay(day)}`;
        case 'zh-CN':
            return `${year % 100}/${month}/${day}`;
        case 'zh-TW':
            return `${year % 100}/${month}/${day}`;
        default:
            return `${getStrDay(day)}/${getStrMonth(month)}`;
    }
};

const toHourMinute = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    if (isNaN(hours) || isNaN(minutes)) return '';
    const hoursString = hours <= 9 ? `0${hours}` : hours.toString(10);
    const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString(10);
    return `${hoursString}:${minutesString}`;
};

const toSecond = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000);
    const seconds = date.getUTCSeconds();
    if (isNaN(seconds)) return '';
    const secondsString = seconds <= 9 ? `0${seconds}` : seconds.toString(10);
    return `${secondsString}s`;
};

const isNewMonth = (unixTimestamp: number, delta: number): boolean => {
    const prevDate = new Date((unixTimestamp - delta) * 1000);
    const curDate = new Date(unixTimestamp * 1000);
    return prevDate.getUTCMonth() !== curDate.getUTCMonth();
};

const toFullDateTime = (unixTimestamp: number, dateTzConverter: TDateTzConverterFn, locale = 'en'): string => {
    const date = new Date(dateTzConverter(unixTimestamp * 1000));
    return date.toLocaleTimeString(locale, {
        timeZone: 'utc',
        month: 'short',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

const getDeltaFromRange = (min: number, max: number, minorsPerMajor: number, maxTicks: number) => {
    const diff = max - min;
    let ticks = diff;
    let i = 1;
    let delta = 1;
    while (ticks > 10 && i < dateTickDeltas.length) {
        delta = dateTickDeltas[i];
        ticks = Math.floor(diff / delta);
        i++;
    }
    return new NumberRange(delta / minorsPerMajor, delta);
};

export const axisLabelDateFormatter = {
    toYear,
    toMonth,
    toDay,
    toHourMinute,
    toSecond,
    isNewMonth,
    toFullDateTime,
    getDeltaFromRange
};
