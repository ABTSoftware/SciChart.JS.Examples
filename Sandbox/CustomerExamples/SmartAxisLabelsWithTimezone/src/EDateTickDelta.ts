// 365 days year 31536000, 365.242 days year 31556926
const YEAR = 31556926;

export enum EDateTickDelta {
    Second1 = 1,
    Second2 = 2,
    Second5 = 5,
    Second10 = 10,
    Second15 = 15,
    Second30 = 30,
    Minute1 = 60,
    Minute2 = 2 * 60,
    Minute5 = 5 * 60,
    Minute10 = 10 * 60,
    Minute15 = 15 * 60,
    Minute30 = 30 * 60,
    Hour1 = 60 * 60,
    Hour3 = 3 * 60 * 60,
    Hour6 = 6 * 60 * 60,
    Hour12 = 12 * 60 * 60,
    Day1 = 24 * 60 * 60,
    Day3 = 3 * 24 * 60 * 60,
    Day5 = 5 * 24 * 60 * 60,
    Day10 = 10 * 24 * 60 * 60,
    Month1 = 30 * 24 * 60 * 60,
    Month3 = 90 * 24 * 60 * 60,
    Month6 = 188 * 24 * 60 * 60,
    Year1 = YEAR,
    Year5 = 5 * YEAR,
    Year10 = 10 * YEAR,
    Year50 = 50 * YEAR
}

export const getDateTickDelta = (value: number) => {
    let curDist = Number.MAX_VALUE;
    for (let i = 0; i < dateTickDeltas.length; i++) {
        const dist = Math.abs(dateTickDeltas[i] - value) / value;
        if (dist > curDist) {
            if (i > 0) {
                return dateTickDeltas[i - 1];
            }
        } else {
            curDist = dist;
        }
    }
    return dateTickDeltas[dateTickDeltas.length - 1];
};

export const dateTickDeltas = [
    EDateTickDelta.Second1,
    EDateTickDelta.Second2,
    EDateTickDelta.Second5,
    EDateTickDelta.Second10,
    EDateTickDelta.Second15,
    EDateTickDelta.Second30,
    EDateTickDelta.Minute1,
    EDateTickDelta.Minute2,
    EDateTickDelta.Minute5,
    EDateTickDelta.Minute10,
    EDateTickDelta.Minute15,
    EDateTickDelta.Minute30,
    EDateTickDelta.Hour1,
    EDateTickDelta.Hour3,
    EDateTickDelta.Hour6,
    EDateTickDelta.Hour12,
    EDateTickDelta.Day1,
    EDateTickDelta.Day3,
    EDateTickDelta.Day5,
    EDateTickDelta.Day10,
    EDateTickDelta.Month1,
    EDateTickDelta.Month3,
    EDateTickDelta.Month6,
    EDateTickDelta.Year1,
    EDateTickDelta.Year5,
    EDateTickDelta.Year10,
    EDateTickDelta.Year50
];

export const dateTickMainDeltas = [
    EDateTickDelta.Second1,
    EDateTickDelta.Minute1,
    EDateTickDelta.Day1,
    EDateTickDelta.Day3,
    EDateTickDelta.Day5,
    EDateTickDelta.Day10,
    EDateTickDelta.Month1,
    EDateTickDelta.Year1
];
