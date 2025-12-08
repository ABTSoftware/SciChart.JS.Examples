import { Rect, SciChartSubSurface } from "scichart";
import { DpiHelper, EAutoRange, NumberRange, NumericAxis, SciChartSurface } from "scichart";
import { CustomLabelProvider } from "./CustomSmartDateLabelProvider";

export function addMainSurfaceAxes(mainSurface: SciChartSurface) {
    const wasmContext = mainSurface.webAssemblyContext2D;

    const xAxis = new NumericAxis(wasmContext, {
        id: "mainXAxis",
        isVisible: false
    });

    const yAxis = new NumericAxis(wasmContext, {
        id: "mainYAxis",
        isVisible: false
    });

    mainSurface.xAxes.add(xAxis);
    mainSurface.yAxes.add(yAxis);

    return { xAxis, yAxis };
}

export function addSubSurfaceAxes(sciChartSurface: SciChartSubSurface, timeOrigin: number) {
    const wasmContext = sciChartSurface.webAssemblyContext2D;

    const maxVisibleRangeSize = (sciChartSurface.subPosition as Rect).height / 20;

    const commonAxisConfig = {
        drawMajorBands: false,
        drawMajorGridLines: true,
        drawMinorGridLines: false,
        drawMajorTickLines: true,
        drawMinorTickLines: true
    };

    const primaryColor = "teal";

    const relativeTimeAxis = new NumericAxis(wasmContext, {
        ...commonAxisConfig,
        id: "relativeTimeAxis",
        labelPrecision: 3,
        // visibleRangeLimit: new NumberRange(0, Infinity),
        // visibleRangeSizeLimit: new NumberRange(0, 20),
        axisTitle: "Time from page load (ms)",
        axisTitleStyle: {
            color: primaryColor,
            fontSize: 12
        },
        majorTickLineStyle: {
            color: primaryColor,
            tickSize: 10,
            strokeThickness: 3
        },
        minorTickLineStyle: {
            color: "black",
            tickSize: 6,
            strokeThickness: 2
        },
        labelStyle: {
            color: primaryColor,
            fontSize: 10
        },
        axisBorder: {
            color: primaryColor,
            borderTop: 0,
            borderBottom: 1,
            borderLeft: 1,
            borderRight: 1
        },
        backgroundColor: "#FFAB9722"
    });

    const yAxis = new NumericAxis(wasmContext, {
        ...commonAxisConfig,
        drawMajorGridLines: false,
        isInnerAxis: true,
        drawLabels: false,

        id: "categoryGroupAxis",
        visibleRange: new NumberRange(-3, maxVisibleRangeSize - 3),
        // visibleRangeSizeLimit: new NumberRange(7, maxVisibleRangeSize),
        // visibleRangeSizeLimit: new NumberRange(10, 20),
        // visibleRangeLimit: new NumberRange(-1, 20),
        flippedCoordinates: true,
        growBy: new NumberRange(0.1, 0.1),
        autoRange: EAutoRange.Never
    });
    relativeTimeAxis.labelProvider.formatLabel = (dataValue: number) => `${(dataValue - timeOrigin).toFixed(1)}`;
    sciChartSurface.xAxes.add(relativeTimeAxis);

    sciChartSurface.yAxes.add(yAxis);

    return { xAxis: relativeTimeAxis, yAxis };
}

export function addVisibleAxes(subSurface: SciChartSubSurface) {
    const wasmContext = subSurface.webAssemblyContext2D;

    const maxVisibleRangeSize = (subSurface.subPosition as Rect).height / (20 * DpiHelper.PIXEL_RATIO);

    const primaryColor = "green";
    const secondaryColor = "black";

    const absoluteTimeAxis = new NumericAxis(wasmContext, {
        id: "absoluteTimeAxis",
        labelProvider: new CustomLabelProvider(),
        visibleRangeLimit: new NumberRange(0, Number.MAX_VALUE),
        // visibleRangeSizeLimit: new NumberRange(0, 20),
        axisTitleStyle: {
            color: primaryColor,
            fontSize: 12
        },
        majorTickLineStyle: {
            color: primaryColor,
            tickSize: 12,
            strokeThickness: 3
        },
        minorTickLineStyle: {
            color: secondaryColor,
            tickSize: 6,
            strokeThickness: 2
        },
        labelStyle: {
            color: primaryColor,
            fontSize: 10
        },
        axisBorder: {
            color: primaryColor,
            borderTop: 0,
            borderBottom: 1,
            borderLeft: 1,
            borderRight: 1
        },
        backgroundColor: "#CDB6FE12",
        axisThickness: 20,

        axisTitle: "Absolute time (HHMMSSms)",

        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorBands: false
    });

    const yAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        visibleRange: new NumberRange(-3, maxVisibleRangeSize - 2),
        // visibleRangeSizeLimit: new NumberRange(7, maxVisibleRangeSize),
        // visibleRangeSizeLimit: new NumberRange(10, 20),
        // visibleRangeLimit: new NumberRange(-1, 20),
        flippedCoordinates: true,
        growBy: new NumberRange(0.1, 0.1),
        autoRange: EAutoRange.Never
    });

    subSurface.xAxes.add(absoluteTimeAxis);
    subSurface.yAxes.add(yAxis);

    return { absoluteTimeAxis, yAxis };
}
