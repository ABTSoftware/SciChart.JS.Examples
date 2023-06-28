import * as React from "react";
import {appTheme} from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

import {
    EAutoRange,
    EAxisAlignment,
    EChart2DModifierType,
    FastLineRenderableSeries,
    IRenderableSeries,
    libraryVersion,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartJsNavyTheme,
    SciChartSurface,
    SeriesSelectionModifier,
    TSciChart,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import {Radix2FFT} from "../../../../../../build/Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/Radix2FFT";
import {INumericAxisOptions} from "scichart/Charting/Visuals/Axis/NumericAxis";

export const divMainChartId = "sciChart1";
export const divCrossSection1 = "sciChart2";
export const divCrossSection2 = "sciChart3";

// This function generates some spectral data for the waterfall chart
const createSpectralData = () => {
    const spectraSize = 1024;
    const timeData = new Array(spectraSize);

    // Generate some random data with spectral components
    for (let i = 0; i < spectraSize; i++) {
        timeData[i] = 2.0 * Math.sin(2 * Math.PI * i / 20) +
            5 * Math.sin(2 * Math.PI * i / 10) +
            2.0 * Math.random();
    }

    // Do a fourier-transform on the data to get the frequency domain
    const transform = new Radix2FFT(spectraSize);
    const yValues = transform.run(timeData)
        .slice(0, 300); // We only want the first N points just to make the example cleaner

    // This is just setting a floor to make the data cleaner for the example
    for (let i = 0; i < yValues.length; i++) {
        yValues[i] = (yValues[i] < -30 || yValues[i] > -5)
            ? (yValues[i] < -30) ? -30 : (Math.random() * 9 - 6)
            : yValues[i];
    }
    yValues[0] = -30;

    // we need x-values (sequential numbers) for the frequency data
    const xValues = yValues.map((value, index) => index);

    return { xValues, yValues };
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

    let mainChartSelectionModifier: SeriesSelectionModifier;

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
            // Todo: This customOffset should be more easily set via library changes before we go live with the example
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
            // Todo: This customOffset should be more easily set via library changes before we go live with the example
            (sciChartSurface.xAxes.get(i) as CustomOffsetAxis).customOffset = 2 * i;

            // Create some data for the example
            const { xValues, yValues } = createSpectralData();

            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                xAxisId: "X" + i,
                yAxisId: "Y" + i,
                stroke: "#64BAE4",
                strokeThickness: 1,
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
            });

            // Insert series in reverse order so the ones at the bottom of the chart are drawn first
            // sciChartSurface.renderableSeries.insert(0, lineSeries);
            sciChartSurface.renderableSeries.add(lineSeries);
        }

        // Add zooming behaviours
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier(),
            new MouseWheelZoomModifier(),
            new ZoomExtentsModifier());

        const updateSeriesSelectionState = (series: IRenderableSeries) => {
            series.stroke = series.isSelected ? "White": series.isHovered ? "#FFBE93" : "#64BAE4";
            series.strokeThickness = series.isSelected ? 3 : series.isHovered ? 2 : 1;
        };

        // Add selection behaviour
        mainChartSelectionModifier = new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: true,
            hitTestRadius: 3,
            onSelectionChanged: args => {
                args.allSeries.forEach(updateSeriesSelectionState);
            },
            onHoverChanged: args => {
                args.allSeries.forEach(updateSeriesSelectionState);
            }
        });
        sciChartSurface.chartModifiers.add(mainChartSelectionModifier);

        return sciChartSurface;
    };

    let crossSectionSelectedSeries: IRenderableSeries;
    let crossSectionHoveredSeries: IRenderableSeries;

    // In the bottom left chart, add two series to show the currently hovered/selected series on the main chart
    // These will be updated in the selection callback below
    const initCrossSectionLeft = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection1, {
            theme
        });

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-30, 5)
        }));

        crossSectionSelectedSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: "#ff6600",
            strokeThickness: 3,
        });
        sciChartSurface.renderableSeries.add(crossSectionSelectedSeries);
        crossSectionHoveredSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: "#64BAE4",
            opacity: 0.33,
            strokeThickness: 2,
        });
        sciChartSurface.renderableSeries.add(crossSectionHoveredSeries);

        return sciChartSurface;
    };

    const initCrossSectionRight = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection2, {
            theme
        });

        return sciChartSurface;
    };

    const charts = await Promise.all([ initMainChart(), initCrossSectionLeft(), initCrossSectionRight() ]);

    // Link interactions together
    mainChartSelectionModifier.selectionChanged.subscribe(args => {
        console.log(`selectedSeries: ${args.selectedSeries[0].dataSeries}`);
        crossSectionSelectedSeries.dataSeries = args.selectedSeries[0].dataSeries;
    });
    mainChartSelectionModifier.hoverChanged.subscribe(args => {
        crossSectionHoveredSeries.dataSeries = args.hoveredSeries[0]?.dataSeries;
    });

    return { charts };
};

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
