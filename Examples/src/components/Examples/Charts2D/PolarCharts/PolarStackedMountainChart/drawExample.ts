import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EColor, 
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    Thickness, 
    GradientParams, 
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    ScaleAnimation,
    PolarMountainRenderableSeries,
    PolarStackedMountainCollection,
    PolarStackedMountainRenderableSeries,
    PolarLegendModifier,
    BaseDataSeries
} from "scichart";
import { appTheme } from "../../../theme";

const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const MountainsDatasets = [
    {
        yValues: [2.7, 1.4, 2.3, 0.8, 2.1, 1.2, 2.4, 2.7, 1.3],
        fillColor: appTheme.VividPurple,
    },
    {
        yValues: [3.2, 0.9, 0.2, 2.5, 1.3, 2.8, 2.1, 1.2, 2.4],
        fillColor: appTheme.VividPink,
    },
    {
        yValues: [1.5, 2.3, 1.7, 2.2, 2.8, 2.9, 1.2, 2.1, 1.1],
        fillColor: appTheme.VividSkyBlue,
    },
    {
        yValues: [1.0, 1.8, 2.7, 1.3, 2.2, 0.3, 1.6, 3.1, 1.2],
        fillColor: appTheme.VividOrange,
    },
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true
    });

    // add Radial Y axis
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        useNativeText: true,
        drawMinorGridLines: false,

        startAngle: Math.PI / 2,
        zoomExtentsToInitialRange: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
    });
    sciChartSurface.yAxes.add(radialYAxis);

    // add Angular X axis
    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,

        visibleRange: new NumberRange(0, 9),
        polarLabelMode: EPolarLabelMode.Parallel,
        
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise
        zoomExtentsToInitialRange: true,
        
        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    // Make collection to hold all the stacked mountains renderable series
    const mountainCollection = new PolarStackedMountainCollection(wasmContext)
    mountainCollection.animation = new WaveAnimation({ duration: 800, zeroLine: 0 }),

    MountainsDatasets.forEach(({yValues, fillColor}) => {
        const polarMountain = new PolarStackedMountainRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: [...xValues, xValues[xValues.length - 1] + 1], // add 1 more xValue to close the loop
                yValues: [...yValues, yValues[0]] // close the loop by drawing to the first yValue
            }),
            fill: fillColor + "88",
            stroke: "white",
            strokeThickness: 1,
        });
        mountainCollection.add(polarMountain);
    })
    sciChartSurface.renderableSeries.add(mountainCollection);

    const legendModifier = new PolarLegendModifier({
        showCheckboxes: true,
    });
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        legendModifier
    );

    // animate the series in when the legend checkboxes are toggled
    mountainCollection.asArray().forEach((series) =>
        series.isVisibleChanged.subscribe((data) => {
            if (data.isVisible) {
                // If you want to zoom to the new range when making a series visible, you need to force a recalculation of the Accumulated values first
                //stackedMountainCollection.setAccumulatedValuesDirty();
                //stackedMountainCollection.updateAccumulatedVectors();
                //sciChartSurface.zoomExtents();
                data.sourceSeries.runAnimation(
                    new ScaleAnimation({ duration: 500 })
                );
            } else {
                // To animate out, we have to trick the series into remaining visible while the animation runs.
                // We set the backing value of isVisible to true, and only set it false when the animation completes
                // @ts-ignore
                data.sourceSeries.isVisibleProperty = true;
                data.sourceSeries.runAnimation(
                    new ScaleAnimation({
                        duration: 500,
                        reverse: true,
                        onCompleted: () => {
                            (data.sourceSeries.dataSeries as BaseDataSeries).revertAnimationVectors();
                            // @ts-ignore
                            data.sourceSeries.isVisibleProperty = false;
                            // Force the legend to update
                            legendModifier.sciChartLegend.invalidateLegend();
                            //sciChartSurface.zoomExtents();
                        },
                    })
                );
            }
        })
    );

    return { sciChartSurface, wasmContext };
};