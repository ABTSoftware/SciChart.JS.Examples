import {
    BoxPlotDataSeries,
    CategoryAxis,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    ENumericFormat,
    FastBoxPlotRenderableSeries,
    ICategoryAxisOptions,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
} from "scichart";
import { appTheme } from "../../../theme";

const CATEGORY_AXIS_OPTIONS: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
    growBy: new NumberRange(0.05, 0.05),
};

const NUMERIC_AXIS_OPTIONS = {
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
    autoRange: EAutoRange.Once,
    flippedCoordinates: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    // 1st sub-surface
    const sub1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0, 0, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    });

    sub1.xAxes.add(
        new CategoryAxis(wasmContext, {
            ...CATEGORY_AXIS_OPTIONS,
            labels: ["P1", "P2", "P3"],
            axisAlignment: EAxisAlignment.Left,
        })
    );
    sub1.yAxes.add(
        new NumericAxis(wasmContext, {
            ...NUMERIC_AXIS_OPTIONS,
            axisAlignment: EAxisAlignment.Bottom,
        })
    );

    const boxSeries1 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [1, 2, 3],
            minimumValues: [0, 1, 0.5],
            maximumValues: [10, 9, 9.5],
            medianValues: [4.5, 5.5, 5],
            lowerQuartileValues: [3, 4, 3.5],
            upperQuartileValues: [7, 6, 6.5],
        }),
        stroke: appTheme.MutedSkyBlue,
        fill: appTheme.MutedSkyBlue + "66",
        strokeThickness: 2,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.MutedSkyBlue,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.MutedSkyBlue,
            strokeThickness: 2,
            dataPointWidth: 0.5,
        },
        medianLine: {
            stroke: appTheme.MutedSkyBlue,
            strokeThickness: 4,
        },
    });
    sub1.renderableSeries.add(boxSeries1);

    // 2nd sub-surface
    const sub2 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.5, 0, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    });

    sub2.xAxes.add(
        new CategoryAxis(wasmContext, {
            labels: ["Box1", "Box2", "Box3", "Box4", "Box5"],
            ...CATEGORY_AXIS_OPTIONS,
        })
    );
    sub2.yAxes.add(
        new NumericAxis(wasmContext, {
            ...NUMERIC_AXIS_OPTIONS,
        })
    );

    const boxSeries2 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            minimumValues: [0, 1, 0.5, 0, 1],
            maximumValues: [10, 9, 9.5, 10, 9],
            medianValues: [4.5, 5.5, 5, 4, 5],
            lowerQuartileValues: [3, 4, 3.5, 3, 4],
            upperQuartileValues: [7, 6, 6.5, 7, 6],
        }),
        stroke: appTheme.VividOrange,
        fill: appTheme.VividOrange + "66",
        strokeThickness: 1,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.6,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.VividOrange,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.VividOrange,
            strokeThickness: 2,
            dataPointWidth: 0.5,
        },
        medianLine: {
            stroke: appTheme.VividOrange,
            strokeThickness: 4,
        },
    });
    sub2.renderableSeries.add(boxSeries2);

    // 3rd sub-surface
    const sub3 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0, 0.5, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    });

    sub3.xAxes.add(
        new CategoryAxis(wasmContext, {
            labels: ["A", "B", "C"],
            ...CATEGORY_AXIS_OPTIONS,
        })
    );
    sub3.yAxes.add(
        new NumericAxis(wasmContext, {
            ...NUMERIC_AXIS_OPTIONS,
        })
    );

    const boxSeries3 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [4, 5, 6],
            minimumValues: [0, 1, 0.5],
            maximumValues: [10, 9, 9.5],
            medianValues: [4.5, 5.5, 5],
            lowerQuartileValues: [3, 4, 3.5],
            upperQuartileValues: [7, 6, 6.5],
        }),
        stroke: appTheme.VividPink,
        fill: appTheme.VividPink + "66",
        strokeThickness: 2,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.VividPink,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.VividPink,
            strokeThickness: 2,
            dataPointWidth: 0.3,
        },
        medianLine: {
            stroke: appTheme.VividPink,
            strokeThickness: 4,
        },
    });
    sub3.renderableSeries.add(boxSeries3);

    // 4th sub-surface
    const sub4 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.5, 0.5, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    });

    sub4.xAxes.add(
        new CategoryAxis(wasmContext, {
            ...CATEGORY_AXIS_OPTIONS,
            labels: ["1st", "2nd", "3rd", "4th"],
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: true,
        })
    );
    sub4.yAxes.add(
        new NumericAxis(wasmContext, {
            ...NUMERIC_AXIS_OPTIONS,
            axisAlignment: EAxisAlignment.Bottom,
            flippedCoordinates: true,
        })
    );

    const boxSeries4 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4],
            minimumValues: [0, 1, 0.5, 0],
            maximumValues: [10, 9, 9.5, 10],
            medianValues: [4.5, 5.5, 5, 4],
            lowerQuartileValues: [3, 4, 3.5, 3],
            upperQuartileValues: [7, 6, 6.5, 7],
        }),
        stroke: appTheme.VividTeal,
        fill: appTheme.VividTeal + "66",
        strokeThickness: 2,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.VividTeal,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.VividTeal,
            strokeThickness: 2,
            dataPointWidth: 0.2,
        },
        medianLine: {
            stroke: appTheme.VividTeal,
            strokeThickness: 4,
        },
    });
    sub4.renderableSeries.add(boxSeries4);

    return { sciChartSurface, wasmContext };
};
