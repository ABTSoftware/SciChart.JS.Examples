import {
    BoxPlotDataSeries,
    CategoryAxis,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    ENumericFormat,
    FastBoxPlotRenderableSeries,
    ICategoryAxisOptions,
    LabelProviderBase2D,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
} from "scichart";
import { appTheme } from "../../../theme";

const drawBoxPlotSubchart = (SciChartSurface: SciChartSurface, position: Rect) => {
    const subSurface = SciChartSubSurface.createSubSurface(SciChartSurface, {
        position,
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new CategoryAxis(SciChartSurface.webAssemblyContext2D, {
        axisAlignment: EAxisAlignment.Bottom,
        growBy: new NumberRange(0.05, 0.05),
        autoRange: EAutoRange.Once,
        flippedCoordinates: false,
    });
    subSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(SciChartSurface.webAssemblyContext2D, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05),
        autoRange: EAutoRange.Once,
        flippedCoordinates: false,
    });
    subSurface.yAxes.add(yAxis);

    return subSurface;
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    const sub1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0, 0, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    })
    const configCategoryAxis: ICategoryAxisOptions = {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        cursorLabelFormat: ENumericFormat.Decimal,
        cursorLabelPrecision: 0,
    };

    const configX = {
        labels: ["A", "B", "C"],
        axisAlignment: EAxisAlignment.Bottom,
        growBy: new NumberRange(0.05, 0.05),
        autoRange: EAutoRange.Once,
        flippedCoordinates: false,
    };

    const xAxis = true
        ? new CategoryAxis(wasmContext, { 
            ...configX, 
            ...configCategoryAxis 
        })
        : new NumericAxis(wasmContext, {
            ...configX
        })
    sub1.xAxes.add(xAxis);

    sub1.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05),
            autoRange: EAutoRange.Once,
            flippedCoordinates: false,
        })
    );

    const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [4, 5, 6],
            minimumValues: [0, 1, 0.5],
            maximumValues: [10, 9, 9.5],
            medianValues: [4.5, 5.5, 5],
            lowerQuartileValues: [3, 4, 3.5],
            upperQuartileValues: [7, 6, 6.5],
        }),
        stroke: appTheme.DarkIndigo,
        strokeThickness: 1,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        fill: appTheme.VividBlue,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.VividRed,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.VividOrange,
            strokeThickness: 2,
            dataPointWidth: 0.3,
        },
        medianLine: {
            stroke: "white",
            strokeThickness: 2,
        },
    });
    sub1.renderableSeries.add(boxSeries);

    // 2nd sub-surface
    const sub2 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.5, 0, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    })
    // const xValues = [4, 5, 6];
    // const minimumValues = [0, 1, 0.5];
    // const maximumValues = [10, 9, 9.5];
    // const medianValues = [4.5, 5.5, 5];
    // const lowerQuartileValues = [3, 4, 3.5];
    // const upperQuartileValues = [7, 6, 6.5];


    const sub3 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0, 0.5, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    })
    // const xValues = [4, 5, 6];
    // const minimumValues = [0, 0, 0.5];
    // const maximumValues = [10, 9, 8];
    // const medianValues = [4.5, 4, 5];
    // const lowerQuartileValues = [3, 2, 3.5];
    // const upperQuartileValues = [7, 6, 6.5];


    const sub4 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.5, 0.5, 0.5, 0.5),
        theme: appTheme.SciChartJsTheme,
    })
    // const xValues = [4, 5, 6];
    // const minimumValues = [0, 0, 0.5];
    // const maximumValues = [10, 9, 8];
    // const medianValues = [4.5, 4, 5];
    // const lowerQuartileValues = [3, 2, 3.5];
    // const upperQuartileValues = [7, 6, 6.5];

    return { sciChartSurface, wasmContext };
}