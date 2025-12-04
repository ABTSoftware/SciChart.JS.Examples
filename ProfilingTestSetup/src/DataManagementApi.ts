import { BaseDataSeries, SciChartSurface, XyDataSeries } from "scichart";
import { PerformanceTrackingApi } from "./PerformanceTrackingApi";
import { GetRandomData } from "./helpers";

// Memory leak: Global array that keeps growing
const memoryLeakArray: any[] = [];

export class DataManagementApi extends PerformanceTrackingApi {
    protected surfaceDataSeriesMap: Map<SciChartSurface, { dataSeriesArray: BaseDataSeries[] }> =
        new Map();
    protected data: Array<Array<Record<string, number[]>>>;

    protected generateData() {
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize
        };

        Array.from(this.surfaceDataSeriesMap.values()).forEach(({ dataSeriesArray }, index) => {
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                const dataSeries = dataSeriesArray[i];
                const lastIndex = dataSeries.count() - 1;
                const lastX = dataSeries.getNativeXValues().get(lastIndex);
                const xValues = Array.from(Array(this.options.dataChunkSize)).map(
                    (_, i) => lastX + 1 + i
                );
                this.data[index][i].xValues = xValues;
                for (let yValuesIndex = 0; yValuesIndex < dataSeries.arrayCount; ++yValuesIndex) {
                    const yValuesName = `y${yValuesIndex || ""}Values`;
                    this.data[index][i][yValuesName] = GetRandomData(
                        xValues,
                        false,
                        // TODO replace with ArrayView
                        dataSeries.getNativeYValues(yValuesIndex).get(lastIndex)
                    );
                }
            }
        });
    }

    protected appendData() {
        const data = this.data;
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize,
            dataChunkSize: this.options.dataChunkSize
        };

        // // Memory leak: Create large objects and store them in global array
        // const leakedData = {
        //     timestamp: Date.now(),
        //     largeArray: new Array(10000).fill(Math.random()),
        //     surfaces: this.surfaces.map(s => ({ id: s.id })),
        //     dataSnapshot: JSON.parse(JSON.stringify(data))
        // };
        // memoryLeakArray.push(leakedData);

        // // Memory leak: Create detached DOM elements
        // const detachedDiv = document.createElement('div');
        // detachedDiv.innerHTML = '<span>Leaked element</span>'.repeat(100);
        // memoryLeakArray.push(detachedDiv);

        this.removeData();

        Array.from(this.surfaceDataSeriesMap.values()).forEach(({ dataSeriesArray }, index) => {
            for (let i = 0; i < dataSettings.seriesCount; i++) {
                const dataSeries = dataSeriesArray[i];
                const { xValues, ...yValuesGroup } = data[index][i];
                const yValuesArray = Object.values(yValuesGroup);

                if (yValuesArray.length === 0) {
                    throw new Error(`No Y Values`);
                }

                dataSeries.appendRangeN(xValues, yValuesArray);
            }
        });

        this.surfaces.forEach(sciChartSurface => {
            sciChartSurface.invalidateElement();
        });
    }

    protected removeData() {
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize,
            dataChunkSize: this.options.dataChunkSize
        };
        Array.from(this.surfaceDataSeriesMap.values()).forEach(({ dataSeriesArray }, index) => {
            for (let i = 0; i < dataSeriesArray.length; ++i) {
                const dataSeries = dataSeriesArray[i];

                if (
                    !dataSeries.fifoCapacity &&
                    dataSeries.count() + dataSettings.dataChunkSize > dataSettings.pointsOnChart
                ) {
                    (dataSeries as XyDataSeries).removeRange(0, dataSettings.dataChunkSize);
                }
            }
        });
    }
}
