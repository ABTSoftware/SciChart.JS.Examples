import { EDateTickDelta } from './EDateTickDelta';

export enum EDateScale {
    Seconds = 'Seconds',
    HoursMinutes = 'HoursMinutes',
    Days = 'Days',
    Months = 'Months',
    Years = 'Years'
}

export const getDateScale = (unixTimestamp: number, axisDateScale: EDateScale, dateTickDelta: number): EDateScale => {
    if (axisDateScale === EDateScale.Years) {
        return EDateScale.Years;
    }
    if (axisDateScale === EDateScale.Months) {
        return EDateScale.Months;
    }
    if (axisDateScale === EDateScale.Days) {
        return EDateScale.Days;
    }
    if (axisDateScale === EDateScale.HoursMinutes) {
        if (unixTimestamp % EDateTickDelta.Day1 < dateTickDelta) {
            return getDateScale(unixTimestamp, EDateScale.Days, dateTickDelta);
        }
        return EDateScale.HoursMinutes;
    }
    if (axisDateScale === EDateScale.Seconds) {
        if (unixTimestamp % EDateTickDelta.Minute1 < dateTickDelta) {
            return getDateScale(unixTimestamp, EDateScale.HoursMinutes, dateTickDelta);
        }
        return EDateScale.Seconds;
    }
    return axisDateScale;
};
