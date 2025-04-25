import {
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
import { appTheme } from "../../../theme";

export const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const YEARS = [
    1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
];
export const TEMPERATURE_DATA = [
    [12.312858, 12.794863, 13.173332, 14.242319, 15.026494, 15.8967905, 16.125097, 16.0047, 15.245733, 14.251504, 13.146228, 12.325032],
    [12.08245, 12.507443, 13.09871, 14.017178, 14.894451, 15.667089, 16.022583, 16.000057, 15.118811, 14.006094, 13.150954, 12.41957],
    [12.0726595, 12.415118, 13.238875, 14.033698, 15.009245, 15.902833, 16.056944, 15.977586, 15.381688, 14.393545, 13.352154, 12.617628],
    [12.393999, 12.883712, 13.373737, 14.482489, 15.439859, 16.166082, 16.350761, 16.253042, 15.393574, 14.268745, 13.131387, 12.578128],
    [12.214997, 12.681549, 13.018332, 14.058149, 14.964326, 15.7506695, 16.027044, 15.874023, 15.245672, 14.145028, 13.067392, 12.441928],
    [12.052399, 12.593054, 13.190579, 14.27894, 15.041011, 15.73894, 15.99124, 15.936546, 15.207633, 14.050722, 13.023944, 12.323272],
    [12.2122, 12.446788, 13.249987, 14.208252, 15.215851, 15.871904, 16.20851, 16.060638, 15.368203, 14.34036, 13.470086, 12.695609],
    [12.53721, 12.721423, 13.600142, 14.29804, 15.341601, 16.006063, 16.26295, 16.064987, 15.451588, 14.365481, 13.315763, 12.543315],
    [12.548483, 12.642036, 13.243136, 14.241573, 15.247941, 15.844065, 16.181763, 16.1575, 15.520181, 14.550451, 13.333045, 12.84282],
    [12.400176, 12.756578, 13.39796, 14.34727, 15.051334, 15.889484, 15.953155, 15.950004, 15.406296, 14.453116, 13.441607, 12.569768],
    [12.589498, 12.735534, 13.497629, 14.432102, 15.331207, 16.059366, 16.314322, 16.141184, 15.57603, 14.618258, 13.501898, 12.766566],
    [12.398165, 12.818922, 13.397719, 14.291743, 15.189911, 16.064089, 16.2323, 16.182554, 15.494456, 14.584331, 13.47152, 12.860763],
    [12.805192, 12.817515, 13.409858, 14.535373, 15.345493, 15.959107, 16.23532, 16.092844, 15.3565445, 14.432366, 13.331739, 12.576232],
    [12.113923, 12.408767, 13.427934, 14.2349825, 15.156445, 15.784512, 16.205524, 16.032562, 15.416246, 14.483524, 13.421947, 12.621545],
    [12.501715, 12.694814, 13.287948, 14.301582, 15.257585, 15.987313, 16.366655, 16.15678, 15.5500765, 14.526386, 13.511364, 12.733565],
    [12.635704, 12.951749, 13.678116, 14.614076, 15.459992, 16.069487, 16.280928, 16.157698, 15.545397, 14.562755, 13.5042715, 12.563801],
    [12.351584, 12.553582, 13.350575, 14.375279, 15.21987, 16.003353, 16.372034, 16.222324, 15.493718, 14.475969, 13.275867, 12.627507],
    [12.276481, 12.550572, 13.272944, 14.415976, 15.43513, 16.102345, 16.269238, 16.187937, 15.559264, 14.665552, 13.56644, 12.633436],
    [12.58878, 12.745218, 13.43308, 14.325264, 15.283069, 16.090355, 16.20393, 16.16618, 15.616046, 14.497789, 13.520184, 12.792078],
    [12.568984, 12.633794, 13.499797, 14.471165, 15.444962, 16.055035, 16.294695, 16.247393, 15.630797, 14.609954, 13.421647, 12.853656],
    [12.634522, 12.928324, 13.637803, 14.418158, 15.4382105, 16.169155, 16.382626, 16.353651, 15.713228, 14.8876295, 13.75632, 13.204671],
    [12.993054, 13.417261, 14.034957, 14.891214, 15.676935, 16.244125, 16.589472, 16.512617, 15.804098, 14.787963, 13.775281, 13.000732],
    [12.8454685, 13.228996, 13.908754, 14.689877, 15.634159, 16.184803, 16.494555, 16.407322, 15.725905, 14.80573, 13.618404, 13.037093],
    [12.682678, 12.992087, 13.682286, 14.666776, 15.513449, 16.20794, 16.507273, 16.319836, 15.645767, 14.800986, 13.608685, 12.996236],
    [12.726316, 13.037866, 13.917256, 14.798871, 15.618407, 16.351522, 16.62583, 16.4674, 15.82509, 14.899514, 13.775336, 13.204703],
    [13.023134, 13.328617, 13.896722, 14.881941, 15.727563, 16.34306, 16.554218, 16.378103, 15.879856, 14.822323, 13.907555, 12.900242],
    [12.6852045, 12.789691, 13.598597, 14.552206, 15.518996, 16.195406, 16.559742, 16.422468, 15.847732, 14.867675, 13.7164545, 12.987495],
    [12.719246, 12.959181, 13.803046, 14.644942, 15.517449, 16.290827, 16.606314, 16.40706, 15.795761, 14.855305, 13.532649, 12.935972],
    [12.688526, 13.022077, 13.9205885, 14.682203, 15.656947, 16.514093, 16.953165, 16.82091, 16.376972, 15.296179, 14.224238, 13.510272],
    [13.140137, 13.539749, 14.137102, 15.031858, 15.913483, 16.657152, 16.907806, 16.822422, 16.174273, 15.245267, 14.098477, 13.423883] // 2024 Jan - Dec
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: [
            "Mean surface temperature by month", 
            "(past 30 years)"
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
        new GradientParams(new Point(0, 0), new Point(0, 1), [
            { offset: 0, color: appTheme.VividBlue },
            { offset: 1, color: appTheme.VividPink }
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
                            stroke: `rgba(${i*2}, ${i}, ${i*2 + 20}, 1)`,
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