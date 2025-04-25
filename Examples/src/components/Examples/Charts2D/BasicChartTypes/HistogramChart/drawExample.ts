import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    Thickness,
    ETextAlignment,
    ETitlePosition,
    ENumericFormat,
    EAxisAlignment,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    EResamplingMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    DataLabelProvider,
    formatNumber,
} from "scichart";
import { appTheme } from "../../../theme";

// Population data by age range
const populationData = {
    xValues: [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
        55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
    ],
    yValues: {
        male: [
            4869936, 5186991, 5175063, 5286053, 5449038, 5752398, 6168124,
            6375035, 6265554, 5900833, 6465830, 7108184, 6769524, 5676968,
            4828153, 3734266, 2732054, 1633630, 587324, 128003, 12023,
        ],
        female: [
            4641147, 4940521, 5010242, 5010526, 5160160, 5501673, 6022599,
            6329356, 6299693, 5930345, 6509757, 7178487, 7011569, 6157651,
            5547296, 4519433, 3704145, 2671974, 1276597, 399148, 60035,
        ],
    },
};

const BREAK_POINTS = [
    0, 10, 15, 20, 30, 45, 60, 70, 80, 90
];

function prepareRectangleData() {
    const totalData = populationData.xValues.map((xValue, index) => {
        const total = 
            populationData.yValues.male[index] +
            populationData.yValues.female[index];
        return { xValue, yValue: total };
    });
    
    // Prepare data for each range
    const xValues: number[] = [];
    const yValues: number[] = [];
    const x1Values: number[] = [];
    const y1Values: number[] = [];

    BREAK_POINTS.forEach((breakPoint, index) => {
        let nextBreakPoint = BREAK_POINTS[index + 1];

        if (nextBreakPoint === undefined) {
            nextBreakPoint = 100; // Set the last range
        }

        const rangePopulation = totalData
            .filter(data => {
                return data.xValue >= breakPoint && data.xValue < nextBreakPoint
            })
            .reduce((sum, data) => sum + data.yValue, 0);
        
        xValues.push(breakPoint);
        yValues.push(rangePopulation);
        x1Values.push(nextBreakPoint);
        y1Values.push(0); // Set y1 to 0 for the bottom of the rectangle
    });
    
    return { xValues, yValues, x1Values, y1Values };
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Europe Population Distribution by Age Range",
        titleStyle: {
            fontSize: 24,
        }
    });
    
    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "Age Range (Years)",
        autoTicks: false,
        majorDelta: 5,
        drawMajorBands: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        axisTitleStyle: {
            fontSize: 14,
            fontFamily: "Arial",
            color: "#ffffff",
            fontStyle: "italic",
        },
        growBy: new NumberRange(0.02, 0.02),
    });
    
    // Custom label formatter to improve readability
    xAxis.labelProvider.formatLabel = (value: number) => {
        if (BREAK_POINTS.includes(value)) {
            return value.toString();
        }
        if (value === 100) {
            return "100+";
        }
        return null
    };
    sciChartSurface.xAxes.add(xAxis);
    
    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Population (Millions)",
        labelFormat: ENumericFormat.Engineering,
        axisAlignment: EAxisAlignment.Left,
        drawMajorBands: false,
        drawMinorGridLines: false,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        axisTitleStyle: {
            fontSize: 14,
            fontFamily: "Arial",
            color: "#ffffff",
            fontStyle: "italic"
        },
        growBy: new NumberRange(0.01, 0.1),
    });
    sciChartSurface.yAxes.add(yAxis);
    
    // Prepare data and create rectangle series
    const { xValues, yValues, x1Values, y1Values} = prepareRectangleData();

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "white",
        fill: appTheme.DarkIndigo,
        opacity: 0.8,
        topCornerRadius: 14,
        bottomCornerRadius: 0,
        dataLabels: {
            color: "#EEE",
            style: {
                fontSize: 12,
            },
            numericFormat: ENumericFormat.Engineering, 
            verticalTextPosition: EVerticalTextPosition.Above,
            horizontalTextPosition: EHorizontalTextPosition.Right,
        }
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);
    
    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );
    
    return { sciChartSurface, wasmContext };
};