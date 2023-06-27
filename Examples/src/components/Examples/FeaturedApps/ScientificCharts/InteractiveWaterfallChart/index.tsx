import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { TBinanceCandleData } from "../../../../../commonTypes/TBinanceCandleData";
import {appTheme} from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import {makeStyles} from "@material-ui/core/styles";

import {
    CategoryAxis,
    DateTimeNumericAxis,
    EFillPaletteMode,
    EStrokePaletteMode,
    EAutoRange,
    EAxisAlignment,
    ELabelAlignment,
    ENumericFormat,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    parseColorToUIntArgb,
    SciChartSurface,
    TextLabelProvider,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier, SciChartJsNavyTheme, TSciChart
} from "scichart";
import {Radix2FFT} from "../../../../../../build/Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/Radix2FFT";
import {INumericAxisOptions} from "scichart/Charting/Visuals/Axis/NumericAxis";

export const divMainChartId = "sciChart1";
export const divCrossSection1 = "sciChart2";
export const divCrossSection2 = "sciChart3";

// This function generates some spectral data for the waterfall chart
const createDataSeries = (wasmContext: TSciChart) => {
    const dataSeries = new XyDataSeries(wasmContext);
    const timeData = new Array(1024);

    // Generate some random data with spectral components
    for (let i = 0; i < 1024; i++) {
        timeData[i] = 2.0 * Math.sin(2 * Math.PI * i / 20) +
            5 * Math.sin(2 * Math.PI * i / 10) +
            2.0 * Math.random();
    }

    // Do a fourier-transform on the data to get the frequency domain
    const transform = new Radix2FFT(1024);
    const frequencyData = transform.run(timeData);
    for (let i = 0; i < frequencyData.length; i++) {
        frequencyData[i] = (frequencyData[i] < -25 || frequencyData[i] > -5)
            ? (frequencyData[i] < -25) ? -25 : (Math.random() * 9 - 6)
            : frequencyData[i];
    }
    frequencyData[0] = -25;
    // we need x-values (sequential numbers) for the frequency data
    const frequencyXValues = frequencyData.map((value, index) => index);

    // append to a scichart dataseries
    dataSeries.appendRange(frequencyXValues, frequencyData);

    return dataSeries;
}

class CustomOffsetAxis extends NumericAxis {
    constructor(wasmContext: TSciChart, options: INumericAxisOptions) {
        super(wasmContext, options);
    }

    public customOffset: number = 0;

    public get offset(): number {
        return this.customOffset;
    }

    public set offset(value: number) {
        // do nothing
    }
}

// This function draws the entire example
const drawExample = async () => {

    const theme = new SciChartJsNavyTheme();

    // This function creates the main chart with waterfall series
    // To do this, we create N series, each with its own X,Y axis with a different X,Y offset
    // all axis other than the first are hidden
    const initMainChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divMainChartId, {
            theme
        });

        const seriesCount = 50;

        for (let i = 0; i < seriesCount; i++) {
            // Create one yAxis per series
            sciChartSurface.yAxes.add(new CustomOffsetAxis(wasmContext, {
                id: "Y" + i,
                axisAlignment: EAxisAlignment.Left,
                maxAutoTicks: 5,
                drawMinorGridLines: false,
                visibleRange: new NumberRange(-60, 60),
                isVisible: i === seriesCount - 1,
            }));
            (sciChartSurface.yAxes.get(i) as CustomOffsetAxis).customOffset = 3 * -i;

            // Create a shared, default xaxis
            sciChartSurface.xAxes.add(new CustomOffsetAxis(wasmContext, {
                id: "X" + i,
                axisAlignment: EAxisAlignment.Bottom,
                maxAutoTicks: 5,
                drawMinorGridLines: false,
                growBy: new NumberRange(0, 0.2),
                isVisible: i === seriesCount - 1,
            }));
            (sciChartSurface.xAxes.get(i) as CustomOffsetAxis).customOffset = 2 * i;

            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                xAxisId: "X" + i,
                yAxisId: "Y" + i,
                stroke: i === 0 ? "White" : "#64BAE4",
                strokeThickness: i === 0 ? 3 : 1,
                dataSeries: createDataSeries(wasmContext)
            });
            sciChartSurface.renderableSeries.insert(0, lineSeries);
        }

        sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new MouseWheelZoomModifier(), new ZoomExtentsModifier());

        return sciChartSurface;
    };

    const initCrossSectionLeft = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection1, {
            theme
        });

        return sciChartSurface;
    };

    const initCrossSectionRight = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection2, {
            theme
        });

        return sciChartSurface;
    };

    const charts = await Promise.all([ initMainChart(), initCrossSectionLeft(), initCrossSectionRight() ]);

    return { charts };
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function InteractiveWaterfallChart() {
    let charts: SciChartSurface[];

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            charts = res.charts;
        })();

        return () => {
            // Ensure deleting charts on React component unmount
            charts?.forEach(c => c.delete());
        }
    }, []);

    return (
        <React.Fragment>
            <div style={{background: appTheme.Background}} className={classes.ChartWrapper}>
                <div style={{width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: appTheme.DarkIndigo}}>
                    <div id={divMainChartId} style={{ flexBasis: "50%" }}/>
                    <div style={{display: "flex", flex: 1 }}>
                        <div id={divCrossSection1} style={{flex: 1 }}/>
                        <div id={divCrossSection2} style={{flex: 1 }}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
