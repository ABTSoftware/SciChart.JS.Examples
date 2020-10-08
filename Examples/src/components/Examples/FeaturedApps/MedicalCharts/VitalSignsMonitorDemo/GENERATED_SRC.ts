export const code = `import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { vitalSignsEcgData } from "./data/vitalSignsEcgData";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAutoRange } from "scichart/types/AutoRange";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { GlowEffect } from "scichart/Charting/Visuals/RenderableSeries/GlowEffect";
import { Point } from "scichart/Core/Point";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import greyImg from "./img/greyImg.png";
import yellowImg from "./img/yellowImg.png";

const divElementId = "chart";
const COLOR_GREEN = "#00FF00";
const COLOR_YELLOW = "#FFFF00";
const COLOR_GREY = "#F5FFFA";
const COLOR_BLUE = "#1E90FF";
const STEP = 10;
const TIMER_TIMEOUT_MS = 20;
const STROKE_THICKNESS = 4;
const POINTS_LOOP = 5200;
const GAP_POINTS = 200;
const DATA_LENGTH = vitalSignsEcgData.xValues.length;

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
const drawExample = async (): Promise<TWebAssemblyChart> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, 600, 600);
    const xAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Once, isVisible: false });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Never,
        visibleRange: new NumberRange(0, 4),
        isVisible: false
    });
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_2;
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

    const effect = new GlowEffect(wasmContext, {
        range: 0,
        intensity: 1,
        color: "#333333",
        offset: new Point(10, 10)
    });

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: COLOR_GREEN,
            dataSeries: dataSeries1,
            effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: COLOR_YELLOW,
            dataSeries: dataSeries2,
            effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: COLOR_GREY,
            dataSeries: dataSeries3,
            effect
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: STROKE_THICKNESS,
            stroke: COLOR_BLUE,
            dataSeries: dataSeries4,
            effect
        })
    );

    // Display leading dot
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 5,
                height: 5,
                strokeThickness: 2,
                fill: "white",
                stroke: "white"
            }),
            dataSeries: new XyDataSeries(wasmContext),
            effect
        })
    );
    return { sciChartSurface, wasmContext };
};

// STYLES
const useStyles = makeStyles(theme => ({
    chartContainer: {
        display: "flex",
        backgroundColor: "black",
        paddingTop: 6,
        width: 800,
        fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";',
        position: "relative"
    },
    infoBoxContainer: {
        flexBasis: 200,
        flexGrow: 0,
        flexShrink: 0,
        "&>div:not(:first-child)": {
            borderTop: "1px solid darkgrey"
        }
    },
    infoBox: {
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        borderLeft: "1px solid darkgrey",
        padding: 6,
        height: 150,
        width: 200,
        backgroundColor: "black"
    },
    ibRow1: {
        flexGrow: 1,
        display: "flex"
    },
    ibRow1Col1: {
        flexGrow: 1,
        fontSize: 32
    },
    ibRow1Col2: {
        textAlign: "right",
        marginTop: 4,
        fontSize: 12
    },
    ibRow2: {
        display: "flex"
    },
    ibRow2Col1: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        paddingBottom: 6,
        fontSize: 14,
        "& img": {
            width: 45
        }
    },
    ibRow2Col2: {
        display: "flex",
        flexDirection: "column",
        fontSize: 44
    }
}));

let currentPoint = 0;
let timerId: NodeJS.Timeout;

// REACT COMPONENT
export default function VitalSignsMonitorDemo() {
    const classes = useStyles();
    const [showButtons, setShowButtons] = React.useState(false);
    const [dataSeries1, setDataSeries1] = React.useState<XyDataSeries>();
    const [dataSeries2, setDataSeries2] = React.useState<XyDataSeries>();
    const [dataSeries3, setDataSeries3] = React.useState<XyDataSeries>();
    const [dataSeries4, setDataSeries4] = React.useState<XyDataSeries>();
    const [leadingDotDataSeries, setLeadingDotDataSeries] = React.useState<XyDataSeries>();
    const [infoEcg, setInfoEcg] = React.useState<number>(0);
    const [infoBloodPressure1, setInfoBloodPressure1] = React.useState<number>(0);
    const [infoBloodPressure2, setInfoBloodPressure2] = React.useState<number>(0);
    const [infoBloodVolume, setInfoBloodVolume] = React.useState<number>(0);
    const [infoBloodOxygenation, setInfoBloodOxygenation] = React.useState<number>(0);
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setDataSeries1(res.sciChartSurface.renderableSeries.get(0).dataSeries as XyDataSeries);
            setDataSeries2(res.sciChartSurface.renderableSeries.get(1).dataSeries as XyDataSeries);
            setDataSeries3(res.sciChartSurface.renderableSeries.get(2).dataSeries as XyDataSeries);
            setDataSeries4(res.sciChartSurface.renderableSeries.get(3).dataSeries as XyDataSeries);
            setLeadingDotDataSeries(res.sciChartSurface.renderableSeries.get(4).dataSeries as XyDataSeries);
            setShowButtons(true);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

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

    const handleStart = () => {
        if (!timerId) {
            runUpdateDataOnTimeout();
        }
    };

    const handleStop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return (
        <div style={{ display: showButtons ? "block" : "none", overflowX: "auto" }}>
            <div className={classes.chartContainer}>
                <div id={divElementId} style={{ width: 600 }} />
                <div className={classes.infoBoxContainer}>
                    <div className={classes.infoBox} style={{ color: COLOR_GREEN }}>
                        <div className={classes.ibRow1}>
                            <div className={classes.ibRow1Col1}>ECG</div>
                            <div className={classes.ibRow1Col2} />
                        </div>
                        <div className={classes.ibRow2}>
                            <div className={classes.ibRow2Col1}>
                                <div style={{ flexGrow: 1 }} />
                                <div>
                                    V1 - 1.4MM
                                    <br />
                                    ST | +0.6 || +0.9
                                </div>
                            </div>
                            <div className={classes.ibRow2Col2}>
                                <div style={{ flexGrow: 1 }} />
                                <div>{infoEcg}</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.infoBox} style={{ color: COLOR_YELLOW }}>
                        <div className={classes.ibRow1}>
                            <div className={classes.ibRow1Col1}>NIBP</div>
                            <div className={classes.ibRow1Col2}>
                                AUTO
                                <br />
                                145/95
                            </div>
                        </div>
                        <div className={classes.ibRow2}>
                            <div className={classes.ibRow2Col1}>
                                <div style={{ flexGrow: 1 }} />
                                <div>
                                    <img src={yellowImg} />
                                </div>
                            </div>
                            <div className={classes.ibRow2Col2}>
                                <div style={{ flexGrow: 1 }} />
                                <div>
                                    {infoBloodPressure1}/{infoBloodPressure2}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.infoBox} style={{ color: COLOR_GREY }}>
                        <div className={classes.ibRow1}>
                            <div className={classes.ibRow1Col1}>SV</div>
                            <div className={classes.ibRow1Col2}>
                                ML 100
                                <br />
                                %**** 55
                            </div>
                        </div>
                        <div className={classes.ibRow2}>
                            <div className={classes.ibRow2Col1}>
                                <div style={{ flexGrow: 1 }} />
                                <div>
                                    <img src={greyImg} />
                                </div>
                            </div>
                            <div className={classes.ibRow2Col2}>
                                <div style={{ flexGrow: 1 }} />
                                <div>{infoBloodVolume.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.infoBox} style={{ color: COLOR_BLUE }}>
                        <div className={classes.ibRow1}>
                            <div className={classes.ibRow1Col1}>
                                SPO<span style={{ fontSize: 12 }}>2</span>
                            </div>
                            <div className={classes.ibRow1Col2}>18:06</div>
                        </div>
                        <div className={classes.ibRow2}>
                            <div className={classes.ibRow2Col1}>
                                <div style={{ flexGrow: 1 }} />
                                <div>
                                    71-
                                    <br />
                                    RESP
                                </div>
                            </div>
                            <div className={classes.ibRow2Col2}>{infoBloodOxygenation}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                If viewed from a mobile device use horizontal scroll
            </div>
            <ButtonGroup
                style={{ marginTop: 20 }}
                size="medium"
                color="primary"
                aria-label="small outlined button group"
            >
                <Button id="startAnimation" onClick={handleStart}>
                    Start
                </Button>
                <Button id="stopAnimation" onClick={handleStop}>
                    Stop
                </Button>
            </ButtonGroup>
        </div>
    );
}
`;