import * as React from "react";
import { appTheme } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

import {
    AnnotationDragDeltaEventArgs,
    CustomAnnotation,
    DefaultPaletteProvider,
    EAutoRange,
    EAxisAlignment,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ELegendOrientation,
    EStrokePaletteMode,
    EVerticalAnchorPoint,
    EXyDirection,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    GradientParams,
    IRenderableSeries,
    LegendModifier,
    libraryVersion,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    Point,
    SciChartJsNavyTheme,
    SciChartSurface,
    SeriesSelectionModifier,
    Thickness,
    TSciChart,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { Radix2FFT } from "../AudioAnalyzer/Radix2FFT";
import { INumericAxisOptions } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { SciChartReact, SciChartGroup } from "scichart-react";
import { resourceUsage } from "process";

export const divMainChartId = "sciChart1";
export const divCrossSection1 = "sciChart2";
export const divCrossSection2 = "sciChart3";

// This function generates some spectral data for the waterfall chart
const createSpectralData = (n: number) => {
    const spectraSize = 1024;
    const timeData = new Array(spectraSize);

    // Generate some random data with spectral components
    for (let i = 0; i < spectraSize; i++) {
        timeData[i] =
            2.0 * Math.sin((2 * Math.PI * i) / (20 + n * 0.2)) +
            5 * Math.sin((2 * Math.PI * i) / (10 + n * 0.01)) +
            10 * Math.sin((2 * Math.PI * i) / (5 + n * -0.002)) +
            2.0 * Math.random();
    }

    // Do a fourier-transform on the data to get the frequency domain
    const transform = new Radix2FFT(spectraSize);
    const yValues = transform.run(timeData).slice(0, 300); // We only want the first N points just to make the example cleaner

    // This is just setting a floor to make the data cleaner for the example
    for (let i = 0; i < yValues.length; i++) {
        yValues[i] =
            yValues[i] < -30 || yValues[i] > -5 ? (yValues[i] < -30 ? -30 : Math.random() * 9 - 6) : yValues[i];
    }
    yValues[0] = -30;

    // we need x-values (sequential numbers) for the frequency data
    const xValues = yValues.map((value, index) => index);

    return { xValues, yValues };
};

// class CustomOffsetAxis extends NumericAxis {
//     constructor(wasmContext: TSciChart, options: INumericAxisOptions) {
//         super(wasmContext, options);
//     }

//     public customOffset: number = 0;

//     public get offset(): number {
//         return this.customOffset;
//     }

//     public set offset(value: number) {
//         // do nothing
//     }
// }

// tslint:disable-next-line:max-classes-per-file
class CrossSectionPaletteProvider extends DefaultPaletteProvider {
    public selectedIndex: number = -1;
    public shouldUpdate: boolean = true;

    public shouldUpdatePalette(): boolean {
        return this.shouldUpdate;
    }

    public overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number): number {
        if (index === this.selectedIndex || index + 1 === this.selectedIndex || index - 1 === this.selectedIndex) {
            return 0xffff8a42;
        }
        return undefined;
    }
}

// This function returns methods for initializing the example
const getChartsInitializationAPI = () => {
    const theme = new SciChartJsNavyTheme();

    let mainChartSurface: SciChartSurface;
    let mainChartSelectionModifier: SeriesSelectionModifier;
    const crossSectionPaletteProvider = new CrossSectionPaletteProvider();
    let dragMeAnnotation: CustomAnnotation;

    // This function creates the main chart with waterfall series
    // To do this, we create N series, each with its own X,Y axis with a different X,Y offset
    // all axis other than the first are hidden
    const initMainChart = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            disableAspect: true,
            theme,
        });

        mainChartSurface = sciChartSurface;

        const seriesCount = 50;
        for (let i = 0; i < seriesCount; i++) {
            // Create one yAxis per series
            const yAxis = new NumericAxis(wasmContext, {
                id: "Y" + i,
                axisAlignment: EAxisAlignment.Left,
                maxAutoTicks: 5,
                drawMinorGridLines: false,
                visibleRange: new NumberRange(-60, 60),
                isVisible: i === seriesCount - 1,
                overrideOffset: 3 * -i,
            });
            sciChartSurface.yAxes.add(yAxis);

            // Create a shared, default xaxis
            const xAxis = new NumericAxis(wasmContext, {
                id: "X" + i,
                axisAlignment: EAxisAlignment.Bottom,
                maxAutoTicks: 5,
                drawMinorGridLines: false,
                growBy: new NumberRange(0, 0.2),
                isVisible: i === seriesCount - 1,
                overrideOffset: 2 * i,
            });
            sciChartSurface.xAxes.add(xAxis);

            // Create some data for the example
            const { xValues, yValues } = createSpectralData(i);
            mainChartSurface.rendered.subscribe(() => {
                // Don't recalculate the palette unless the selected index changes
                crossSectionPaletteProvider.shouldUpdate = false;
            });
            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                id: "S" + i,
                xAxisId: "X" + i,
                yAxisId: "Y" + i,
                stroke: "#64BAE4",
                strokeThickness: 1,
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: `Spectra ${i}` }),
                paletteProvider: crossSectionPaletteProvider,
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

        // Place an annotation with further instructions in the top right of the chart
        const promptAnnotation = new CustomAnnotation({
            svgString: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="82">
              <g>
                <line x1="5" y1="77" x2="40" y2="42" stroke="#ffffff" stroke-dasharray="2,2" />
                <circle cx="5" cy="77" r="5" fill="#ffffff" />
                <g>
                  <rect x="20" y="2" width="98" height="40" rx="10" ry="10" fill="#64BAE433" stroke="#64BAE4" stroke-width="2" />
                  <text x="68" y="24" fill="white" text-anchor="middle" alignment-baseline="middle" font-size="12">Hover/click chart</text>
                </g>
              </g>
            </svg>`,
            xAxisId: "X0",
            yAxisId: "Y0",
            isEditable: false,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            x1: 0.9,
            y1: 0.1,
        });

        sciChartSurface.annotations.add(promptAnnotation);

        // Add zooming behaviours
        sciChartSurface.chartModifiers.add(
            new ZoomPanModifier({ xyDirection: EXyDirection.XDirection }),
            new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
            new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection })
        );

        const updateSeriesSelectionState = (series: IRenderableSeries) => {
            series.stroke = series.isSelected ? "White" : series.isHovered ? "#FFBE93" : "#64BAE4";
            series.strokeThickness = series.isSelected || series.isHovered ? 3 : 1;
        };

        let prevSelectedSeries: IRenderableSeries = sciChartSurface.renderableSeries.get(0);
        // Add selection behaviour
        mainChartSelectionModifier = new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: true,
            hitTestRadius: 5,
            onSelectionChanged: (args) => {
                if (args.selectedSeries.length > 0) {
                    prevSelectedSeries = args.selectedSeries[0];
                    args.allSeries.forEach(updateSeriesSelectionState);
                } else {
                    prevSelectedSeries.isSelected = true;
                }
            },
            onHoverChanged: (args) => {
                args.allSeries.forEach(updateSeriesSelectionState);
            },
        });
        sciChartSurface.chartModifiers.add(mainChartSelectionModifier);
        return { sciChartSurface };
    };

    let crossSectionSelectedSeries: IRenderableSeries;
    let crossSectionHoveredSeries: IRenderableSeries;
    let crossSectionSliceSeries: XyDataSeries;
    let crossSectionLegendModifier: LegendModifier;

    // In the bottom left chart, add two series to show the currently hovered/selected series on the main chart
    // These will be updated in the selection callback below
    const initCrossSectionLeft = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            disableAspect: true,
            theme,
        });

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Always,
                drawMinorGridLines: false,
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                axisAlignment: EAxisAlignment.Left,
                visibleRange: new NumberRange(-30, 5),
                drawMinorGridLines: false,
            })
        );

        crossSectionSelectedSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: "#ff6600",
            strokeThickness: 3,
        });
        sciChartSurface.renderableSeries.add(crossSectionSelectedSeries);
        crossSectionHoveredSeries = new FastMountainRenderableSeries(wasmContext, {
            stroke: "#64BAE477",
            strokeThickness: 3,
            strokeDashArray: [2, 2],
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "#64BAE455", offset: 0 },
                { color: "#64BAE400", offset: 1 },
            ]),
            dataSeries: crossSectionSliceSeries,
            zeroLineY: -999,
        });
        sciChartSurface.renderableSeries.add(crossSectionHoveredSeries);

        // Add a legend to the bottom left chart
        crossSectionLegendModifier = new LegendModifier({
            showCheckboxes: false,
            orientation: ELegendOrientation.Horizontal,
        });
        crossSectionLegendModifier.isEnabled = false;
        sciChartSurface.chartModifiers.add(crossSectionLegendModifier);

        return { sciChartSurface };
    };

    const initCrossSectionRight = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            disableAspect: true,
            theme,
            title: "Cross Section Slice",
            titleStyle: {
                fontSize: 13,
                padding: Thickness.fromNumber(10),
            },
        });

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Always,
                drawMinorGridLines: false,
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                axisAlignment: EAxisAlignment.Left,
                visibleRange: new NumberRange(-30, 5),
                drawMinorGridLines: false,
            })
        );

        crossSectionSliceSeries = new XyDataSeries(wasmContext);
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                stroke: "#64BAE4",
                strokeThickness: 3,
                strokeDashArray: [2, 2],
                fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#64BAE477", offset: 0 },
                    { color: "#64BAE433", offset: 1 },
                ]),
                dataSeries: crossSectionSliceSeries,
                zeroLineY: -999,
            })
        );

        return { sciChartSurface };
    };

    const configureAfterInit = () => {
        // Link interactions together
        mainChartSelectionModifier.selectionChanged.subscribe((args) => {
            const selectedSeries = args.selectedSeries[0]?.dataSeries;
            if (selectedSeries) {
                crossSectionSelectedSeries.dataSeries = selectedSeries;
            }
            crossSectionLegendModifier.isEnabled = true;
            crossSectionLegendModifier.sciChartLegend?.invalidateLegend();
        });
        mainChartSelectionModifier.hoverChanged.subscribe((args) => {
            const hoveredSeries = args.hoveredSeries[0]?.dataSeries;
            if (hoveredSeries) {
                crossSectionHoveredSeries.dataSeries = hoveredSeries;
            }
            crossSectionLegendModifier.sciChartLegend?.invalidateLegend();
        });

        // Add a function to update drawing the cross-selection when the drag annotation is dragged
        const updateDragAnnotation = () => {
            // Don't allow to drag vertically, only horizontal
            dragMeAnnotation.y1 = -25;

            // Find the index to the x-values that the axis marker is on
            // Note you could just loop getNativeXValues() here but the wasmContext.NumberUtil function does it for you
            const dataIndex = mainChartSurface.webAssemblyContext2D.NumberUtil.FindIndex(
                mainChartSurface.renderableSeries.get(0).dataSeries.getNativeXValues(),
                dragMeAnnotation.x1,
                mainChartSurface.webAssemblyContext2D.SCRTFindIndexSearchMode.Nearest,
                true
            );

            crossSectionPaletteProvider.selectedIndex = dataIndex;
            crossSectionPaletteProvider.shouldUpdate = true;
            mainChartSurface.invalidateElement();
            crossSectionSliceSeries.clear();
            for (let i = 0; i < mainChartSurface.renderableSeries.size(); i++) {
                crossSectionSliceSeries.append(
                    i,
                    mainChartSurface.renderableSeries.get(i).dataSeries.getNativeYValues().get(dataIndex)
                );
            }
        };

        // Run it once
        updateDragAnnotation();

        //Run it when user drags the annotation
        dragMeAnnotation.dragDelta.subscribe((args: AnnotationDragDeltaEventArgs) => {
            updateDragAnnotation();

            //Run it when user drags the annotation
            dragMeAnnotation.dragDelta.subscribe((args: AnnotationDragDeltaEventArgs) => {
                updateDragAnnotation();
            });

            mainChartSurface.renderableSeries.get(0).isSelected = true;
        });
    };

    return { initMainChart, initCrossSectionLeft, initCrossSectionRight, configureAfterInit };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function InteractiveWaterfallChart() {
    const [chartsInitializationAPI] = useState(getChartsInitializationAPI);

    return (
        <React.Fragment>
            <div style={{ background: appTheme.Background }} className={classes.ChartWrapper}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: appTheme.DarkIndigo,
                    }}
                >
                    <SciChartGroup
                        onInit={() => {
                            chartsInitializationAPI.configureAfterInit();
                        }} // callback executed when all charts within the group are initialized
                    >
                        <SciChartReact
                            style={{ flex: 1, flexBasis: "50%" }}
                            initChart={chartsInitializationAPI.initMainChart}
                        />
                        <div style={{ display: "flex", flex: 1, flexBasis: "50%" }}>
                            <SciChartReact
                                style={{ flex: 1 }}
                                initChart={chartsInitializationAPI.initCrossSectionLeft}
                            />
                            <SciChartReact
                                style={{ flex: 1 }}
                                initChart={chartsInitializationAPI.initCrossSectionRight}
                            />
                        </div>
                    </SciChartGroup>
                </div>
            </div>
        </React.Fragment>
    );
}
