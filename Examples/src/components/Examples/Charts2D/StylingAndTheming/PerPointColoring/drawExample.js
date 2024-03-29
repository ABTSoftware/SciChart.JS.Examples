import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import {
    BoxAnnotation,
    ECoordinateMode,
    EDataLabelSkipMode,
    EHorizontalAnchorPoint,
    ELabelPlacement,
    EllipsePointMarker,
    EStrokePaletteMode,
    FastLineRenderableSeries,
    HorizontalLineAnnotation,
    NumberRange,
    NumericAxis,
    parseColorToUIntArgb,
    SciChartSurface,
    TextAnnotation,
    Thickness,
    XyDataSeries,
    XyScatterRenderableSeries,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    // Create the X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { maxAutoTicks: 5 }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { maxAutoTicks: 5, growBy: new NumberRange(0.05, 0.2) }));
    const { xValues, yValues } = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(50);
    let THRESHOLD_HIGH_LEVEL = 0;
    let THRESHOLD_LOW_LEVEL = -2;
    // For performance reasons PaletteProviders require colors as Argb numbers e.g. 0xFFFF0000 = red
    const THRESHOLD_LOW_COLOR_ARGB = parseColorToUIntArgb(appTheme.VividPink);
    const THRESHOLD_HIGH_COLOR_ARGB = parseColorToUIntArgb(appTheme.VividTeal);
    const getColor = (yValue) => {
        if (yValue < THRESHOLD_LOW_LEVEL) {
            return THRESHOLD_LOW_COLOR_ARGB;
        }
        if (yValue > THRESHOLD_HIGH_LEVEL) {
            return THRESHOLD_HIGH_COLOR_ARGB;
        }
        // Undefined means use default series stroke on this data-point
        return undefined;
    };
    // PaletteProvider API allows for per-point colouring, filling of points or areas based on a rule
    // see PaletteProvider API for more details
    const strokePaletteProvider = {
        onAttached(parentSeries) {},
        onDetached() {},
        strokePaletteMode: EStrokePaletteMode.GRADIENT,
        // This function called once per data-point for line stroke. Colors returned must be in ARGB format (uint) e.g. 0xFF0000FF is Red
        overrideStrokeArgb(xValue, yValue, index, opacity, metadata) {
            return getColor(yValue);
        },
    };
    // Create a line series with threshold palette provider
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            strokeThickness: 4,
            stroke: appTheme.VividOrange,
            dataLabels: {
                style: { fontFamily: "Arial", fontSize: 13, padding: Thickness.fromNumber(5) },
                color: appTheme.PaleSkyBlue,
                skipMode: EDataLabelSkipMode.SkipIfOverlapPrevious,
            },
            paletteProvider: strokePaletteProvider,
        })
    );
    const pointPaletteProvider = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached(parentSeries) {},
        onDetached() {},
        // This function called once per data-point for scatter fill
        overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
            const color = getColor(yValue);
            return { stroke: color, fill: color };
        },
    };
    // Create a scatter series with threshold paletteprovider
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                stroke: appTheme.VividOrange,
                fill: appTheme.VividOrange,
            }),
            paletteProvider: pointPaletteProvider,
        })
    );
    // Add annotations to fill the threshold areas
    const boxHighAnnotation = new BoxAnnotation({
        x1: 0,
        x2: 1,
        y1: THRESHOLD_LOW_LEVEL,
        y2: -9999,
        fill: appTheme.VividPink + "11",
        strokeThickness: 0,
        xCoordinateMode: ECoordinateMode.Relative,
    });
    sciChartSurface.annotations.add(boxHighAnnotation);
    const boxLowAnnotation = new BoxAnnotation({
        x1: 0,
        x2: 1,
        y1: THRESHOLD_HIGH_LEVEL,
        y2: 9999,
        fill: appTheme.VividTeal + "11",
        strokeThickness: 0,
        xCoordinateMode: ECoordinateMode.Relative,
    });
    sciChartSurface.annotations.add(boxLowAnnotation);
    // Add annotations to show the thresholds
    const thresholdHighAnnotation = new HorizontalLineAnnotation({
        stroke: appTheme.VividTeal,
        strokeThickness: 2,
        strokeDashArray: [3, 3],
        y1: THRESHOLD_HIGH_LEVEL,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "High warning",
        axisLabelFill: appTheme.VividTeal,
        axisFontSize: 16,
        showLabel: true,
        isEditable: true,
        onDrag: (args) => {
            // When the vertical line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            THRESHOLD_HIGH_LEVEL = thresholdHighAnnotation.y1;
            boxLowAnnotation.y1 = thresholdHighAnnotation.y1;
            sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(thresholdHighAnnotation);
    const thresholdLowAnnotation = new HorizontalLineAnnotation({
        stroke: appTheme.VividPink,
        strokeThickness: 2,
        strokeDashArray: [3, 3],
        labelPlacement: ELabelPlacement.BottomLeft,
        y1: THRESHOLD_LOW_LEVEL,
        labelValue: "Low warning",
        axisLabelFill: appTheme.VividPink,
        axisFontSize: 16,
        showLabel: true,
        isEditable: true,
        onDrag: (args) => {
            // When the vertical line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            THRESHOLD_LOW_LEVEL = thresholdLowAnnotation.y1;
            boxHighAnnotation.y1 = THRESHOLD_LOW_LEVEL;
            sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(thresholdLowAnnotation);
    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Per point colouring in SciChart.js. Can be applied to lines, areas, scatter points and bubbles",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0,
            y1: 0,
            xCoordShift: 10,
            yCoordShift: 10,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );
    return { sciChartSurface, wasmContext };
};
