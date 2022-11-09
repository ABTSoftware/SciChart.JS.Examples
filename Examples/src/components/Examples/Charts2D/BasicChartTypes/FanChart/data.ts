import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";

export type TVarPoint = {
    date: number;
    actual: number;
    varMax: number;
    var4: number;
    var3: number;
    var2: number;
    var1: number;
    varMin: number;
}

export function getVarianceData(): TVarPoint[] {
    const varianceData: TVarPoint[] = [];
    const startDate = 1546300800; // 1st Jan 2019
    const dateStep = 1546387200 - startDate // one day;

    const length: number = 10;
    const yValues: number[] = new RandomWalkGenerator().Seed(923478).getRandomWalkSeries(length).yValues;
    for(let i = 0; i < length; i++) {
        const date = startDate + dateStep * i;

        let varMax: number = NaN;
        let var4: number = NaN;
        let var3: number = NaN;
        let var2: number = NaN;
        let var1: number = NaN;
        let varMin: number = NaN;

        if (i > 4) {
            varMax = yValues[i] + (i - 5) * 0.3;
            var4 = yValues[i] + (i - 5) * 0.2;
            var3 = yValues[i] + (i - 5) * 0.1;
            var2 = yValues[i] - (i - 5) * 0.1;
            var1 = yValues[i] - (i - 5) * 0.2;
            varMin = yValues[i] - (i - 5) * 0.3;
        }

        varianceData.push({date, actual: yValues[i], varMax, var4, var3, var2, var1, varMin});
    }

    return varianceData;
}
