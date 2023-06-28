import * as React from "react";
import {appTheme} from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

import {
    AnnotationDragDeltaEventArgs,
    CustomAnnotation,
    DefaultPaletteProvider,
    EAutoRange,
    EAxisAlignment,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EXyDirection,
    FastLineRenderableSeries,
    IRenderableSeries,
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
const createSpectralData = (n : number) => {
    const spectraSize = 1024;
    const timeData = new Array(spectraSize);

    // Generate some random data with spectral components
    for (let i = 0; i < spectraSize; i++) {
        timeData[i] = 2.0 * Math.sin(2 * Math.PI * i / (20 + n * 0.2)) +
            5 * Math.sin(2 * Math.PI * i / (10 + n * 0.01)) +
            10 * Math.sin(2 * Math.PI * i / (5 + n * -0.002)) +
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

// tslint:disable-next-line:max-classes-per-file
class CrossSectionPaletteProvider extends DefaultPaletteProvider {

    public selectedIndex: number = -1;
    public override overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number): number {
        if (index === this.selectedIndex || index + 1 === this.selectedIndex || index -1 === this.selectedIndex) {
            return 0xFFFF8A42;
        }
        return undefined;
    }
}

// This function draws the entire example
const drawExample = async () => {

    const theme = new SciChartJsNavyTheme();

    let mainChartSelectionModifier: SeriesSelectionModifier;
    let dragMeAnnotation: CustomAnnotation;

    // This function creates the main chart with waterfall series
    // To do this, we create N series, each with its own X,Y axis with a different X,Y offset
    // all axis other than the first are hidden
    const initMainChart = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divMainChartId, {
            theme
        });

        const seriesCount = 50;
        const crossSectionPaletteProvider = new CrossSectionPaletteProvider();

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
            const { xValues, yValues } = createSpectralData(i);

            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                xAxisId: "X" + i,
                yAxisId: "Y" + i,
                stroke: "#64BAE4",
                strokeThickness: 1,
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
                paletteProvider: crossSectionPaletteProvider
            });

            // Insert series in reverse order so the ones at the bottom of the chart are drawn first
            // sciChartSurface.renderableSeries.insert(0, lineSeries);
            sciChartSurface.renderableSeries.add(lineSeries);
        }

        // Add an annotation which can be dragged horizontally to update the bottom right chart
        dragMeAnnotation = new CustomAnnotation({
            svgString: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="82">
                  <g>
                    <line x1="50%" y1="10" x2="50%" y2="40" stroke="#FFBE93" stroke-dasharray="2,2" />
                    <circle cx="50%" cy="10" r="5" fill="#FFBE93" />
                    <rect x="2" y="40" rx="10" ry="10" width="96" height="40" fill="#64BAE433" stroke="#64BAE4" stroke-width="2" />
                    <text x="50%" y="60" fill="White" text-anchor="middle" alignment-baseline="middle" >Drag me!</text>
                  </g>
                </svg>`,
            x1: 133,
            y1: -25,
            xAxisId: "X0",
            yAxisId: "Y0",
            isEditable: true,
            annotationsGripsFill: "Transparent",
            annotationsGripsStroke: "Transparent",
            selectionBoxStroke: "Transparent",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
        });
        sciChartSurface.annotations.add(dragMeAnnotation);

        // Add a function to update drawing the cross-selection when the drag annotation is dragged
        const updateDragAnnotation = () => {
            // Don't allow to drag vertically, only horizontal
            dragMeAnnotation.y1 = -25;

            // Find the index to the x-values that the axis marker is on
            // Note you could just loop getNativeXValues() here but the wasmContext.NumberUtil function does it for you
            const dataIndex = wasmContext.NumberUtil.FindIndex(
                sciChartSurface.renderableSeries.get(0).dataSeries.getNativeXValues(),
                dragMeAnnotation.x1,
                wasmContext.SCRTFindIndexSearchMode.Nearest,
                true);

            crossSectionPaletteProvider.selectedIndex = dataIndex;
            sciChartSurface.invalidateElement();
        };

        // Run it once
        updateDragAnnotation();

        // Run it when user drags the annotation
        dragMeAnnotation.dragDelta.subscribe((args: AnnotationDragDeltaEventArgs) => {
            updateDragAnnotation();
        });

        // Add zooming behaviours
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection}),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection}),
            new ZoomExtentsModifier( { xyDirection: EXyDirection.XDirection }));

        const updateSeriesSelectionState = (series: IRenderableSeries) => {
            series.stroke = series.isSelected ? "White": series.isHovered ? "#FFBE93" : "#64BAE4";
            series.strokeThickness = series.isSelected ? 3 : series.isHovered ? 2 : 1;
        };

        // Add selection behaviour
        mainChartSelectionModifier = new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: true,
            hitTestRadius: 5,
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
    let crossSectionSliceSeries: XyDataSeries;

    // In the bottom left chart, add two series to show the currently hovered/selected series on the main chart
    // These will be updated in the selection callback below
    const initCrossSectionLeft = async () => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection1, {
            theme
        });

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawMinorGridLines: false,
        }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-30, 5),
            drawMinorGridLines: false,
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

        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawMinorGridLines: false,
        }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(-30, 5),
            drawMinorGridLines: false,
        }));

        crossSectionSliceSeries = new XyDataSeries(wasmContext);
        sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
            stroke: "#64BAE4",
            strokeDashArray: [2,2],
            strokeThickness: 2,
            dataSeries: crossSectionSliceSeries,
        }));

        return sciChartSurface;
    };

    const charts = await Promise.all([ initMainChart(), initCrossSectionLeft(), initCrossSectionRight() ]);

    const mainChartSurface = charts[0];

    // Link interactions together
    mainChartSelectionModifier.selectionChanged.subscribe(args => {
        crossSectionSelectedSeries.dataSeries = args.selectedSeries[0]?.dataSeries;
    });
    mainChartSelectionModifier.hoverChanged.subscribe(args => {
        crossSectionHoveredSeries.dataSeries = args.hoveredSeries[0]?.dataSeries;
    });
    dragMeAnnotation.dragDelta.subscribe((args: AnnotationDragDeltaEventArgs) => {
        // Find the index to the x-values that the axis marker is on
        // Note you could just loop getNativeXValues() here but the wasmContext.NumberUtil function does it for you
        const dataIndex = mainChartSurface.webAssemblyContext2D.NumberUtil.FindIndex(
            mainChartSurface.renderableSeries.get(0).dataSeries.getNativeXValues(),
            dragMeAnnotation.x1,
            mainChartSurface.webAssemblyContext2D.SCRTFindIndexSearchMode.Nearest,
            true);

        crossSectionSliceSeries.clear();
        for(let i = 0; i < mainChartSurface.renderableSeries.size(); i++) {
            crossSectionSliceSeries.append(i, mainChartSurface.renderableSeries.get(i).dataSeries.getNativeYValues().get(dataIndex));
        }
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
