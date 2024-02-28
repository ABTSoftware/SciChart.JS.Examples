import { RandomWalkGenerator } from "scichart-example-dependencies";
export function getVarianceData() {
    const varianceData = [];
    const startDate = 1546300800; // 1st Jan 2019
    const dateStep = 1546387200 - startDate; // one day;
    const length = 10;
    const yValues = new RandomWalkGenerator().Seed(923478).getRandomWalkSeries(length).yValues;
    for (let i = 0; i < length; i++) {
        const date = startDate + dateStep * i;
        let varMax = NaN;
        let var4 = NaN;
        let var3 = NaN;
        let var2 = NaN;
        let var1 = NaN;
        let varMin = NaN;
        if (i > 4) {
            varMax = yValues[i] + (i - 5) * 0.3;
            var4 = yValues[i] + (i - 5) * 0.2;
            var3 = yValues[i] + (i - 5) * 0.1;
            var2 = yValues[i] - (i - 5) * 0.1;
            var1 = yValues[i] - (i - 5) * 0.2;
            varMin = yValues[i] - (i - 5) * 0.3;
        }
        varianceData.push({ date, actual: yValues[i], varMax, var4, var3, var2, var1, varMin });
    }
    return varianceData;
}
