export const code = `import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { vitalSignsEcgData } from "./data/vitalSignsEcgData";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAutoRange } from "scichart/types/AutoRange";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { GlowEffect } from "scichart/Charting/Visuals/RenderableSeries/GlowEffect";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";

const divElementId = "chart";
const STEP = 10;
const TIMER_TIMEOUT_MS = 20;
const STROKE_THICKNESS = 4;
const POINTS_LOOP = 5200;
const GAP_POINTS = 200;
const DATA_LENGTH = vitalSignsEcgData.xValues.length;

let timerId: NodeJS.Timeout;

// PREPARE DATA
const {
    xValues,
    ecgHeartRateValues,
    bloodPressureValues,
    bloodVolumeValues,
    bloodOxygenationValues
} = vitalSignsEcgData;
const prepareData = () => {
    const delta1 = (ecgHeartRateValues[DATA_LENGTH - 1] - ecgHeartRateValues[0]) / (DATA_LENGTH - 1);
    const delta2 = (bloodPressureValues[DATA_LENGTH - 1] - bloodPressureValues[0]) / (DATA_LENGTH - 1);
    const delta3 = (bloodVolumeValues[DATA_LENGTH - 1] - bloodVolumeValues[0]) / (DATA_LENGTH - 1);
    const delta4 = (bloodOxygenationValues[DATA_LENGTH - 1] - bloodOxygenationValues[0]) / (DATA_LENGTH - 1);
    xValues.forEach((_el, index) => {
        ecgHeartRateValues[index] = (ecgHeartRateValues[index] - delta1 * index - 0.7) / 0.3 + 3;
        bloodPressureValues[index] = (bloodPressureValues[index] - delta2 * index - 0.4) / 0.3 + 1.9;
        bloodVolumeValues[index] = (bloodVolumeValues[index] - delta3 * index - 0.15) / 0.3 + 1.1;
        bloodOxygenationValues[index] = (bloodOxygenationValues[index] - delta4 * index) / 0.2;
    });
};
prepareData();

// HELPER FUNCTIONS
const getValuesFromData = (xIndex: number) => {
    const xArr: number[] = [];
    const xPlusGapArr: number[] = [];
    const ecgHeartRateArr: number[] = [];
    const bloodPressureArr: number[] = [];
    const bloodVolumeArr: number[] = [];
    const bloodOxygenationArr: number[] = [];
    for (let i = 0; i < STEP; i++) {
        const dataIndex = (xIndex + i) % DATA_LENGTH;
        const x = (xIndex + i) % POINTS_LOOP;
        const xPlusGap = (xIndex + i + GAP_POINTS) % POINTS_LOOP;
        xArr.push(x);
        xPlusGapArr.push(xPlusGap);
        ecgHeartRateArr.push(ecgHeartRateValues[dataIndex]);
        bloodPressureArr.push(bloodPressureValues[dataIndex]);
        bloodVolumeArr.push(bloodVolumeValues[dataIndex]);
        bloodOxygenationArr.push(bloodOxygenationValues[dataIndex]);
    }
    return {
        xArr,
        xPlusGapArr,
        ecgHeartRateArr,
        bloodPressureArr,
        bloodVolumeArr,
        bloodOxygenationArr
    };
};

// SCICHART
const drawExample = async (
    setInfoEcg: React.Dispatch<React.SetStateAction<number>>,
    setInfoBloodPressure1: React.Dispatch<React.SetStateAction<number>>,
    setInfoBloodPressure2: React.Dispatch<React.SetStateAction<number>>,
    setInfoBloodVolume: React.Dispatch<React.SetStateAction<number>>,
    setInfoBloodOxygenation: React.Dispatch<React.SetStateAction<number>>
) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });
    const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Once, isVisible: false });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(0, 4),
        isVisible: false
    });
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal;
    sciChartSurface.yAxes.add(yAxis);

    // Create and fill initial data series
    const dataSeries1 = new XyDataSeries(wasmContext);
    const dataSeries2 = new XyDataSeries(wasmContext);
    const dataSeries3 = new XyDataSeries(wasmContext);
    const dataSeries4 = new XyDataSeries(wasmContext);
    for (let i = 0; i < POINTS_LOOP; i++) {
        dataSeries1.append(i, NaN);
        dataSeries2.append(i, NaN);
        dataSeries3.append(i, NaN);
        dataSeries4.append(i, NaN);
    }

    const effect = new GlowEffect(wasmContext);

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividOrange,
            dataSeries: dataSeries1,
            // effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividSkyBlue,
            dataSeries: dataSeries2,
            // effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividPink,
            dataSeries: dataSeries3,
            // effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: appTheme.VividTeal,
            dataSeries: dataSeries4,
            // effect
        })
    );

    // Display leading dot
    const leadingDotDataSeries = new XyDataSeries(wasmContext);
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                strokeThickness: 2,
                fill: appTheme.ForegroundColor,
                stroke: appTheme.ForegroundColor,
            }),
            dataSeries: leadingDotDataSeries,
            effect
        })
    );

    const runUpdateDataOnTimeout = () => {
        const {
            xArr,
            xPlusGapArr,
            ecgHeartRateArr,
            bloodPressureArr,
            bloodVolumeArr,
            bloodOxygenationArr
        } = getValuesFromData(currentPoint);
        currentPoint += STEP;
        if (leadingDotDataSeries.count() > 0) {
            leadingDotDataSeries.removeRange(0, leadingDotDataSeries.count() - 1);
        }
        leadingDotDataSeries.append(xArr[STEP - 1], ecgHeartRateArr[STEP - 1]);
        leadingDotDataSeries.append(xArr[STEP - 1], bloodPressureArr[STEP - 1]);
        leadingDotDataSeries.append(xArr[STEP - 1], bloodVolumeArr[STEP - 1]);
        leadingDotDataSeries.append(xArr[STEP - 1], bloodOxygenationArr[STEP - 1]);
        for (let i = 0; i < STEP; i++) {
            dataSeries1.update(xArr[i], ecgHeartRateArr[i]);
            dataSeries1.update(xPlusGapArr[i], NaN);
            dataSeries2.update(xArr[i], bloodPressureArr[i]);
            dataSeries2.update(xPlusGapArr[i], NaN);
            dataSeries3.update(xArr[i], bloodVolumeArr[i]);
            dataSeries3.update(xPlusGapArr[i], NaN);
            dataSeries4.update(xArr[i], bloodOxygenationArr[i]);
            dataSeries4.update(xPlusGapArr[i], NaN);
        }
        // Update Info panel
        if (currentPoint % 1000 === 0) {
            const ecg = ecgHeartRateArr[STEP - 1];
            setInfoEcg(Math.floor(ecg * 20));
            const bloodPressure = bloodPressureArr[STEP - 1];
            setInfoBloodPressure1(Math.floor(bloodPressure * 46));
            setInfoBloodPressure2(Math.floor(bloodPressure * 31));
            const bloodVolume = bloodVolumeArr[STEP - 1] + 3;
            setInfoBloodVolume(bloodVolume + 8.6);
            const bloodOxygenation = bloodOxygenationArr[STEP - 1];
            setInfoBloodOxygenation(Math.floor(bloodOxygenation * 10 + 93));
        }
        timerId = setTimeout(runUpdateDataOnTimeout, TIMER_TIMEOUT_MS);
    };

    const handleStop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    const handleStart = () => {
        if (timerId) {
            handleStop();
        }
        runUpdateDataOnTimeout();
    };

    return { sciChartSurface, wasmContext, controls: { handleStart, handleStop } };
};

let currentPoint = 0;
let scs: SciChartSurface;
let autoStartTimerId: NodeJS.Timeout;

// REACT COMPONENT
export default function VitalSignsMonitorDemo() {
    const [infoEcg, setInfoEcg] = React.useState<number>(0);
    const [infoBloodPressure1, setInfoBloodPressure1] = React.useState<number>(0);
    const [infoBloodPressure2, setInfoBloodPressure2] = React.useState<number>(0);
    const [infoBloodVolume, setInfoBloodVolume] = React.useState<number>(0);
    const [infoBloodOxygenation, setInfoBloodOxygenation] = React.useState<number>(0);
    const [controls, setControls] = React.useState({ handleStart: () => {}, handleStop: () => {} });

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(
                setInfoEcg,
                setInfoBloodPressure1,
                setInfoBloodPressure2,
                setInfoBloodVolume,
                setInfoBloodOxygenation
            );
            scs = res.sciChartSurface;
            setControls(res.controls);
            autoStartTimerId = setTimeout(res.controls.handleStart, 0);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            controls.handleStop();
            clearTimeout(timerId);
            clearTimeout(autoStartTimerId);
            scs?.delete();
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div className={classes.ChartContainer}>
                <div id={divElementId} className={classes.VitalSigns} />
                <div className={classes.InfoBoxContainer}>
                    <div className={classes.InfoBox} style={{ color: appTheme.VividOrange, background: appTheme.Background }}>
                        <div className={classes.IbRow1}>
                            <div className={classes.IbRow1Col1}>ECG</div>
                        </div>
                        <div className={classes.IbRow2}>
                            <div className={classes.IbRow2Col1}>
                                <div>
                                    V1 - 1.4MM
                                    <br />
                                    ST | +0.6 || +0.9
                                </div>
                            </div>
                            <div className={classes.IbRow2Col2}>
                                <div>{infoEcg}</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.InfoBox} style={{ color: appTheme.VividSkyBlue, background: appTheme.Background }}>
                        <div className={classes.IbRow1}>
                            <div className={classes.IbRow1Col1}>NIBP</div>
                            <div className={classes.IbRow1Col2}>
                                AUTO
                                <br />
                                145/95
                            </div>
                        </div>
                        <div className={classes.IbRow2}>
                            <div className={classes.IbRow2Col2}>
                                <div>
                                    {infoBloodPressure1}/{infoBloodPressure2}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.InfoBox} style={{ color: appTheme.VividPink, background: appTheme.Background }}>
                        <div className={classes.IbRow1}>
                            <div className={classes.IbRow1Col1}>SV</div>
                            <div className={classes.IbRow1Col2}>
                                ML 100
                                <br />
                                %**** 55
                            </div>
                        </div>
                        <div className={classes.IbRow2}>
                            <div className={classes.IbRow2Col2}>
                                <div>{infoBloodVolume.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.InfoBox} style={{ color: appTheme.VividTeal, background: appTheme.Background }}>
                        <div className={classes.IbRow1}>
                            <div className={classes.IbRow1Col1}>
                                SPO<span style={{ fontSize: 12 }}>2</span>
                            </div>
                            <div className={classes.IbRow1Col2}>18:06</div>
                        </div>
                        <div className={classes.IbRow2}>
                            <div className={classes.IbRow2Col1}>
                                <div>
                                    71-
                                    <br />
                                    RESP
                                </div>
                            </div>
                            <div className={classes.IbRow2Col2}>{infoBloodOxygenation}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
`;