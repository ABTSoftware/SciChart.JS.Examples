import {
    CategoryAxis,
    EllipsePointMarker,
    EventHandler,
    FastLineRenderableSeries,
    NumberRange,
    NumericAxis,
    RightAlignedOuterVerticallyStackedAxisLayoutStrategy,
    SciChartSurface,
    XyDataSeries,
} from "scichart";
import { vitalSignsEcgData } from "./data/vitalSignsEcgData";
import { appTheme } from "../../../theme";

const STEP = 10;
const TIMER_TIMEOUT_MS = 20;
const STROKE_THICKNESS = 4;
const POINTS_LOOP = 5200;
const GAP_POINTS = 50;
const DATA_LENGTH = vitalSignsEcgData.xValues.length;

const { ecgHeartRateValues, bloodPressureValues, bloodVolumeValues, bloodOxygenationValues } = vitalSignsEcgData;

// HELPER FUNCTIONS
const getValuesFromData = (xIndex: number) => {
    const xArr: number[] = [];
    const ecgHeartRateArr: number[] = [];
    const bloodPressureArr: number[] = [];
    const bloodVolumeArr: number[] = [];
    const bloodOxygenationArr: number[] = [];
    for (let i = 0; i < STEP; i++) {
        const dataIndex = (xIndex + i) % DATA_LENGTH;
        const x = xIndex + i;
        xArr.push(x);
        ecgHeartRateArr.push(ecgHeartRateValues[dataIndex]);
        bloodPressureArr.push(bloodPressureValues[dataIndex]);
        bloodVolumeArr.push(bloodVolumeValues[dataIndex]);
        bloodOxygenationArr.push(bloodOxygenationValues[dataIndex]);
    }
    return {
        xArr,
        ecgHeartRateArr,
        bloodPressureArr,
        bloodVolumeArr,
        bloodOxygenationArr,
    };
};

export type TDataUpdateInfo = {
    ecg: number;
    bloodPressure1: number;
    bloodPressure2: number;
    bloodVolume: number;
    bloodOxygenation: number;
};

// SCICHART
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create a single, shared X-axis, pre-sized to fit the data in X, and is invisible

    // Note: For fifoSweeping mode to work, the X-Axis must be a CategoryAxis
    //      NumericAxis is also supported, but x-values must then be offsets from 0, ie do x % fifoCapacity.
    //      See more info in the docs
    const xAxis = new CategoryAxis(wasmContext, {
        visibleRange: new NumberRange(0, POINTS_LOOP),
        isVisible: false,
    });
    sciChartSurface.xAxes.add(xAxis);

    // Create multiple y-axis, one per trace. Using the stacked vertically layout strategy
    const yAxisHeartRate = new NumericAxis(wasmContext, {
        id: "yHeartRate",
        visibleRange: new NumberRange(0.7, 1.0),
        isVisible: false,
    });
    const yAxisBloodPressure = new NumericAxis(wasmContext, {
        id: "yBloodPressure",
        visibleRange: new NumberRange(0.4, 0.8),
        isVisible: false,
    });
    const yAxisBloodVolume = new NumericAxis(wasmContext, {
        id: "yBloodVolume",
        visibleRange: new NumberRange(0.1, 0.5),
        isVisible: false,
    });
    const yAxisBloodOxygenation = new NumericAxis(wasmContext, {
        id: "yBloodOxygenation",
        visibleRange: new NumberRange(0, 0.2),
        isVisible: false,
    });
    sciChartSurface.layoutManager!.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
    sciChartSurface.yAxes.add(yAxisHeartRate, yAxisBloodPressure, yAxisBloodVolume, yAxisBloodOxygenation);

    // Using the NEW fifoCapacity, fifoSweeping mode in SciChart.js v3.2 we specify a number of points
    // we want in the viewport. When the right edge of the viewport is reached, the series wraps around

    const fifoSweepingGap = GAP_POINTS;
    const dataSeries1 = new XyDataSeries(wasmContext, {
        fifoCapacity: POINTS_LOOP,
        fifoSweeping: true,
        fifoSweepingGap,
    });
    const dataSeries2 = new XyDataSeries(wasmContext, {
        fifoCapacity: POINTS_LOOP,
        fifoSweeping: true,
        fifoSweepingGap,
    });
    const dataSeries3 = new XyDataSeries(wasmContext, {
        fifoCapacity: POINTS_LOOP,
        fifoSweeping: true,
        fifoSweepingGap,
    });
    const dataSeries4 = new XyDataSeries(wasmContext, {
        fifoCapacity: POINTS_LOOP,
        fifoSweeping: true,
        fifoSweepingGap,
    });

    // A pointmarker with lastPointOnly = true will be used for all series to mark the last point
    const pointMarkerOptions = {
        width: 7,
        height: 7,
        strokeThickness: 2,
        fill: appTheme.MutedSkyBlue,
        lastPointOnly: true,
    };

    // Create four RenderableSeries which render the data
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxisHeartRate.id,
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividOrange,
            dataSeries: dataSeries1,
            pointMarker: new EllipsePointMarker(wasmContext, { ...pointMarkerOptions, stroke: appTheme.VividOrange }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxisBloodPressure.id,
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividSkyBlue,
            dataSeries: dataSeries2,
            pointMarker: new EllipsePointMarker(wasmContext, { ...pointMarkerOptions, stroke: appTheme.VividSkyBlue }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxisBloodVolume.id,
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividPink,
            dataSeries: dataSeries3,
            pointMarker: new EllipsePointMarker(wasmContext, { ...pointMarkerOptions, stroke: appTheme.VividPink }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            yAxisId: yAxisBloodOxygenation.id,
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividTeal,
            dataSeries: dataSeries4,
            pointMarker: new EllipsePointMarker(wasmContext, { ...pointMarkerOptions, stroke: appTheme.VividTeal }),
        })
    );

    const dataUpdateEventHandler = new EventHandler<TDataUpdateInfo>();

    let timerId: NodeJS.Timeout;
    let currentPoint = 0;

    // The following code is run once per timer-step to update the data in the charts
    // Here you would subsitute your own callback to receive data from your data feed or sensors
    const runUpdateDataOnTimeout = () => {
        // Get data
        const { xArr, ecgHeartRateArr, bloodPressureArr, bloodVolumeArr, bloodOxygenationArr } =
            getValuesFromData(currentPoint);
        currentPoint += STEP;

        // appendRange when fifoSweepingMode = true and fifoCapacity is reached will cause the series to wrap around
        dataSeries1.appendRange(xArr, ecgHeartRateArr);
        dataSeries2.appendRange(xArr, bloodPressureArr);
        dataSeries3.appendRange(xArr, bloodVolumeArr);
        dataSeries4.appendRange(xArr, bloodOxygenationArr);

        // Update Info panel
        if (currentPoint % 1000 === 0) {
            const ecg = ecgHeartRateArr[STEP - 1];
            const bloodPressure = bloodPressureArr[STEP - 1];
            const bloodVolume = bloodVolumeArr[STEP - 1] + 3;
            const bloodOxygenation = bloodOxygenationArr[STEP - 1];

            const dataUpdateInfo = {
                ecg: Math.floor(ecg * 20),
                bloodPressure1: Math.floor(bloodPressure * 46),
                bloodPressure2: Math.floor(bloodPressure * 31),
                bloodVolume: bloodVolume + 8.6,
                bloodOxygenation: Math.floor(bloodOxygenation * 10 + 93),
            };
            dataUpdateEventHandler.raiseEvent(dataUpdateInfo);
        }
        timerId = setTimeout(runUpdateDataOnTimeout, TIMER_TIMEOUT_MS);
    };

    const subscribeToDataUpdates = (handler: (info: TDataUpdateInfo) => void) => {
        dataUpdateEventHandler.subscribe(handler);

        // automatically cleanup subscription whe surface is deleted
        sciChartSurface.addDeletable({ delete: () => dataUpdateEventHandler.unsubscribeAll() });
    };

    const stopUpdate = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    const startUpdate = () => {
        if (timerId) {
            stopUpdate();
        }
        runUpdateDataOnTimeout();
    };

    return { sciChartSurface, subscribeToDataUpdates, controls: { startUpdate, stopUpdate } };
};
