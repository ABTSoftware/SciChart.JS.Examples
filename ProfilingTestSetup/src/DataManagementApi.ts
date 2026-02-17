import {
    BaseDataSeries,
    BaseHeatmapDataSeries,
    EDataSeriesType,
    ESeriesType,
    IDataSeries,
    SciChartSurface,
    UniformHeatmapDataSeries,
    vectorToArrayViewF64,
    XyDataSeries
} from "scichart";
import { PerformanceTrackingApi } from "./PerformanceTrackingApi";
import { GetRandomData } from "./helpers";

// Memory leak: Global array that keeps growing
const memoryLeakArray: any[] = [];

export class DataManagementApi extends PerformanceTrackingApi {
    protected surfaceDataSeriesMap: Map<SciChartSurface, { dataSeriesArray: IDataSeries[] }> =
        new Map();
    protected data: Record<string, Array<Record<string, number[]>>>;

    protected generateDataForSurface(surface: SciChartSurface) {
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize
        };

        const { dataSeriesArray } = this.surfaceDataSeriesMap.get(surface);

        for (let i = 0; i < dataSettings.seriesCount; i++) {
            const dataSeries = dataSeriesArray[i];
            if (dataSeries.type === EDataSeriesType.HeatmapUniform) {
                const heatmapDataSeries = dataSeries as UniformHeatmapDataSeries;
                
                this.data[surface.id][i].xValues = [heatmapDataSeries.xStart, heatmapDataSeries.xStep, heatmapDataSeries.yStart, heatmapDataSeries.yStep];

                const zValues = Array.from([[]])
                Object.assign(this.data[surface.id][i], zValues);

            } else {
                const lastIndex = dataSeries.count() - 1;
                const lastX = lastIndex > 0 ? dataSeries.getNativeXValues().get(lastIndex) : 0;

                const xValues = Array.from(Array(this.options.dataChunkSize)).map(
                    (_, i) => lastX + 1 + i
                );
                this.data[surface.id][i].xValues = xValues;
                for (
                    let yValuesIndex = 0;
                    yValuesIndex < (dataSeries as BaseDataSeries).arrayCount;
                    ++yValuesIndex
                ) {
                    const yValuesName = `y${yValuesIndex || ""}Values`;

                    const lastY =
                        lastIndex > 0
                            ? dataSeries.getNativeYValues(yValuesIndex).get(lastIndex)
                            : 0;
                    this.data[surface.id][i][yValuesName] = GetRandomData(xValues, false, lastY);
                }
            }
        }
    }

    protected generateData() {
        Array.from(this.surfaceDataSeriesMap.keys()).forEach(s => this.generateDataForSurface(s));
    }

    protected appendDataOnSurface(surface: SciChartSurface) {
        const data = this.data;
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize,
            dataChunkSize: this.options.dataChunkSize
        };

        this.trimDataOnSurface(surface);

        const { dataSeriesArray } = this.surfaceDataSeriesMap.get(surface);

        if (!dataSettings.seriesCount) {
            surface.invalidateElement();
        }

        for (let i = 0; i < dataSettings.seriesCount; i++) {
            const dataSeries = dataSeriesArray[i];
            if (dataSeries.type === EDataSeriesType.HeatmapUniform) {
                const { xValues, ...yValuesGroup } = data[surface.id][i];

                // (dataSeries as BaseHeatmapDataSeries).setZValues();
            } else {
                const { xValues, ...yValuesGroup } = data[surface.id][i];
                const yValuesArray = Object.values(yValuesGroup);

                if (yValuesArray.length === 0) {
                    throw new Error(`No Y Values`);
                }

                (dataSeries as BaseDataSeries).appendRangeN(xValues, yValuesArray);
            }
        }
    }

    protected appendData() {
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

        // Generate data first, then append
        this.generateData();
        Array.from(this.surfaceDataSeriesMap.keys()).forEach(s => this.appendDataOnSurface(s));
    }

    protected trimDataOnSurface(surface: SciChartSurface) {
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize,
            dataChunkSize: this.options.dataChunkSize
        };

        const { dataSeriesArray } = this.surfaceDataSeriesMap.get(surface);
        for (let i = 0; i < dataSeriesArray.length; ++i) {
            const dataSeries = dataSeriesArray[i];

            if (
                !dataSeries.fifoCapacity &&
                dataSeries.count() + dataSettings.dataChunkSize > dataSettings.pointsOnChart
            ) {
                (dataSeries as XyDataSeries).removeRange(0, dataSettings.dataChunkSize);
            }
        }
    }

    protected trimData() {
        Array.from(this.surfaceDataSeriesMap.keys()).forEach(s => this.trimDataOnSurface(s));
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

                (dataSeries as XyDataSeries).removeRange(0, dataSettings.dataChunkSize);
            }
        });
    }
}
