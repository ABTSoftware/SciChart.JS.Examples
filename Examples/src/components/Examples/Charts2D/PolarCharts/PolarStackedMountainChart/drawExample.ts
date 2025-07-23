import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment,  
    EPolarLabelMode,
    WaveAnimation,
    PolarStackedMountainCollection,
    PolarStackedMountainRenderableSeries,
    PolarLegendModifier,
} from "scichart";
import { appTheme } from "../../../theme";

const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const MountainsDatasets = [
    {
        yValues: [2.7, 1.4, 2.3, 2.1, 1.2, 1.5, 2.4, 1.5, 2.7, 1.3],
        fillColor: appTheme.DarkIndigo,
    },
    {
        yValues: [3.2, 0.9, 2, 2.5, 1.3, 2.8, 2.1, 2, 1.2, 2.4],
        fillColor: appTheme.VividBlue,
    },
    {
        yValues: [0.3, 2.3, 1.7, 3.2, 2, 2.9, 1, 2, 2.1, 1.1],
        fillColor: appTheme.VividOrange,
    },
    {
        yValues: [2.1, 1.8, 2.7, 0.5, 2.2, 0.3, 3, 1.6, 2.1, 1],
        fillColor: appTheme.VividPink,
    },
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // add Radial Y axis
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,

        visibleRange: new NumberRange(0, 9),
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

        visibleRange: new NumberRange(0, 10),
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
            fill: fillColor + "BB", // 75% opacity
            stroke: "white",
            strokeThickness: 1,
        });
        mountainCollection.add(polarMountain);
    })
    sciChartSurface.renderableSeries.add(mountainCollection);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        new PolarLegendModifier({
            showCheckboxes: true,
            backgroundColor: "#88888833",
        })
    );

    return { sciChartSurface, wasmContext };
};