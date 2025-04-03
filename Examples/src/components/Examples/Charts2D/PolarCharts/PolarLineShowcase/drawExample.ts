import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    GradientParams, 
    Point, 
    PolarLegendModifier,
    PolarCategoryAxis,
    PaletteFactory,
    PolarLineRenderableSeries,
    EAnimationType,
    ELegendPlacement
} from "scichart";
import { TEMPERATURE_DATA, MONTHS_SHORT, YEARS } from "./data";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: [
            "Mean surface temperature by month", 
            "(past 40 years)"
        ],
        titleStyle: {
            fontSize: 24
        }
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        drawLabels: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white"
        },
        labelPostfix: "°C",
        autoTicks: false,
        majorDelta: 1,
        drawMinorGridLines: false,
        visibleRange: new NumberRange(12, 17), // min and max temperatures
        zoomExtentsToInitialRange: true,
        innerRadius: 0.05, // center gap size
        startAngle: Math.PI / 2 // make temperature labels stacked vertically
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular, // set this as the angular axis
        autoTicks: false,
        majorDelta: 1, // one tick per month
        flippedCoordinates: true, // grow clockwise
        startAngle: Math.PI / 2, // start "Jan" at 12 o'clock
        visibleRange: new NumberRange(0, 12), // 12 months
        labels: MONTHS_SHORT
    });
    sciChartSurface.xAxes.add(polarXAxis);

    // Add series
    const highlightedPalette = PaletteFactory.createYGradient(
        wasmContext,
        new GradientParams(new Point(0, 0), new Point(1, 1), [
            { offset: 0, color: appTheme.VividBlue },
            { offset: 1, color: appTheme.VividRed }
        ]),
        new NumberRange(13, 17) // the range of y-values to apply the gradient to
    );

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (let i = 0; i < TEMPERATURE_DATA.length; i++) {
        sciChartSurface.renderableSeries.add(
            new PolarLineRenderableSeries(wasmContext, {
                // apply a gradient stroke to the last 5 years (2019-2024)
                ...(i >= TEMPERATURE_DATA.length - 5
                    ? {
                            paletteProvider: highlightedPalette,
                            strokeThickness: 3
                        }
                    : {
                            stroke: `rgba(${i}, ${i}, ${i + 20}, 1)`,
                            strokeThickness: 2
                        }),

                seriesName: `${YEARS[i]}`,
                animation: {
                    type: EAnimationType.Sweep,
                    options: {
                        duration: 300,
                        delay: 100 * i
                    }
                },
                clipToTotalAngle: true,
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: xValues,
                    yValues: [
                        ...TEMPERATURE_DATA[i],
                        TEMPERATURE_DATA[i + 1] ? TEMPERATURE_DATA[i + 1][0] : TEMPERATURE_DATA[i][11]
                    ]
                })
            })
        );
    }

    // split half of the years into two legends
    const leftLegend = new PolarLegendModifier({
        showCheckboxes: true,
        backgroundColor: "rgba(90, 90, 90, 0.5)",
        placement: ELegendPlacement.TopLeft
    });

    const rightLegend = new PolarLegendModifier({
        showCheckboxes: true,
        backgroundColor: "rgba(90, 90, 90, 0.5)",
        placement: ELegendPlacement.TopRight
    });

    // Map through all series and split them into the two legends
    sciChartSurface.renderableSeries.asArray().forEach((rs, i) => {
        if (i < TEMPERATURE_DATA.length / 2) {
            leftLegend.includeSeries(rs, true);
        } else {
            rightLegend.includeSeries(rs, true);
        }
    });

    // Add modifiers
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        leftLegend,
        rightLegend
    );

    return { sciChartSurface, wasmContext };
};