export type TDateTzConverterFn = (time: number) => number;

/**
 * Creates GMT date from string
 * @param dateStr The input string, for example '01/07/2010, 01:00:00'
 * @return time in milliseconds since Unix Epoch
 */
export function createGmtDateFromString(dateStr: string): number {
    const day = parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(3, 5), 10);
    const year = parseInt(dateStr.substring(6, 10), 10);
    const hour = parseInt(dateStr.substring(12, 14), 10);
    const minute = parseInt(dateStr.substring(15, 17), 10);
    const second = parseInt(dateStr.substring(18, 20), 10);
    return Date.UTC(year, month - 1, day, hour, minute, second);
}

/**
 * Creates GMT date from ISO string
 * @param dateStr The input ISO string, for example '2022-07-13T00:00:00'
 * @return time in milliseconds since Unix Epoch
 */
export function createGmtDateFromISOString(dateStr: string): number {
    const b = dateStr.split(/\D+/);
    const date = new Date(Date.UTC(parseInt(b[0]), parseInt(b[1]) - 1, parseInt(b[2]), parseInt(b[3]), parseInt(b[4]), parseInt(b[5])));
    return date.getTime();
}

/**
 * Creates date timezone converter which takes the UTC time in milliseconds and returns the local time
 * @param timeZone
 */
export function createDateTzConverter(timeZone: string): TDateTzConverterFn {
    const dtf = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    /**
     * Converts time UTC time to timezone time
     * @param time The UTC time
     * @returns time for the selected timezone
     */
    const dateTzConverter = (time: number): number => {
        const strLocalDate = dtf.format(new Date(time));
        return createGmtDateFromString(strLocalDate);
    };
    return dateTzConverter;
}

/**
 * Calculates the offset
 * @param unitTimestamp - in seconds
 * @param timeZone
 */
export function getTimezoneOffset(unitTimestamp: number, timeZone: string) {
    const d = new Date(unitTimestamp * 1000);
    const a = d.toLocaleString('ja', { timeZone }).split(/[/\s:]/);
    const date = a as unknown as [year: number, month: number, date: number, hours: number, minutes: number, seconds: number, ms: number];
    date[1]--;
    const t1 = Date.UTC.apply(null, date);
    const t2 = new Date(d).setMilliseconds(0);
    return (t2 - t1) / 1000;
}
