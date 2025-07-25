import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    ENumericFormat,
    EAxisAlignment,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    ICustomTextureOptions,
    Logger,
} from "scichart";
import { appTheme } from "../../../theme";

// Population data by age range
const populationData = {
    xValues: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    yValues: {
        male: [
            4869936, 5186991, 5175063, 5286053, 5449038, 5752398, 6168124, 6375035, 6265554, 5900833, 6465830, 7108184,
            6769524, 5676968, 4828153, 3734266, 2732054, 1633630, 587324, 128003, 12023,
        ],
        female: [
            4641147, 4940521, 5010242, 5010526, 5160160, 5501673, 6022599, 6329356, 6299693, 5930345, 6509757, 7178487,
            7011569, 6157651, 5547296, 4519433, 3704145, 2671974, 1276597, 399148, 60035,
        ],
    },
};

const BREAK_POINTS = [0, 20, 30, 45, 65, 70, 80];

function prepareRectangleData() {
    const totalData = populationData.xValues.map((xValue, index) => {
        const total = populationData.yValues.male[index] + populationData.yValues.female[index];
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
            .filter((data) => {
                return data.xValue >= breakPoint && data.xValue < nextBreakPoint;
            })
            .reduce((sum, data) => sum + data.yValue, 0);

        xValues.push(breakPoint);
        yValues.push(rangePopulation);
        x1Values.push(nextBreakPoint);
        y1Values.push(0); // Set y1 to 0 for the bottom of the rectangle
    });

    return { xValues, yValues, x1Values, y1Values };
}

class StickFigureTextureOptions implements ICustomTextureOptions {
    options: { stroke: string };
    textureHeight: number = 48;
    textureWidth: number = 48;
    repeat?: boolean = true;

    public constructor(options: { stroke: string; repeat: boolean; textureHeight: number; textureWidth: number }) {
        this.options = options;
        this.textureHeight = options.textureHeight;
        this.textureWidth = options.textureWidth;
    }

    public createTexture(
        context: CanvasRenderingContext2D,
        options: { fill: string; opacity: number; stroke: string }
    ) {
        context.fillStyle = options.fill;
        context.fillRect(0, 0, this.textureWidth, this.textureHeight);
        context.strokeStyle = options.stroke;

        // Set up transformation: move to center, rotate, move back for
        context.translate(this.textureWidth / 2, this.textureHeight / 2);
        context.translate(-this.textureWidth / 2, -this.textureHeight / 2);

        // Proportional values
        const centerX = this.textureWidth / 2;
        const headRadius = Math.min(this.textureWidth, this.textureHeight) * 0.16; // 16% of smaller dimension
        const headY = this.textureHeight * 0.25;
        const bodyTopY = headY + headRadius;
        const bodyBottomY = this.textureHeight * 0.63;
        const armY = bodyTopY + this.textureHeight * 0.06;
        const armSpan = this.textureWidth * 0.38; // arms reach out 19% each side
        const legY = bodyBottomY;
        const legSpan = this.textureWidth * 0.25; // legs out 12.5% each side
        const legBottomY = this.textureHeight * 0.97;

        // Head
        context.beginPath();
        context.arc(centerX, headY, headRadius, 0, Math.PI * 2);
        context.stroke();

        // Body
        context.beginPath();
        context.moveTo(centerX, bodyTopY);
        context.lineTo(centerX, bodyBottomY);
        context.stroke();

        // Left Arm
        context.beginPath();
        context.moveTo(centerX, armY);
        context.lineTo(centerX - armSpan, armY + this.textureHeight * 0.09);
        context.stroke();

        // Right Arm
        context.beginPath();
        context.moveTo(centerX, armY);
        context.lineTo(centerX + armSpan, armY + this.textureHeight * 0.09);
        context.stroke();

        // Left Leg
        context.beginPath();
        context.moveTo(centerX, legY);
        context.lineTo(centerX - legSpan, legBottomY);
        context.stroke();

        // Right Leg
        context.beginPath();
        context.moveTo(centerX, legY);
        context.lineTo(centerX + legSpan, legBottomY);
        context.stroke();
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Europe Population Distribution by Age Range",
        titleStyle: {
            fontSize: 24,
        },
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
            fontSize: 13,
            fontFamily: "Arial",
            color: "#ffffff",
            fontStyle: "italic",
        },
        growBy: new NumberRange(0.02, 0.02),
    });
    xAxis.labelProvider.formatLabel = (value: number) => {
        // Custom label formatter to improve readability
        if (BREAK_POINTS.includes(value)) {
            return value.toString();
        }
        if (value === 100) {
            return "100+";
        }
        return null;
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
            fontStyle: "italic",
        },
        growBy: new NumberRange(0.01, 0.1),
    });
    sciChartSurface.yAxes.add(yAxis);

    // Prepare data and create rectangle series
    const { xValues, yValues, x1Values, y1Values } = prepareRectangleData();

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values,
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: appTheme.DarkIndigo,
        opacity: 0.8,
        fill: appTheme.MutedSkyBlue,
        topCornerRadius: 8,
        bottomCornerRadius: 0,
        customTextureOptions: new StickFigureTextureOptions({
            stroke: appTheme.MutedBlue,
            repeat: true,
            textureWidth: 40,
            textureHeight: 40,
        }),
        dataLabels: {
            color: appTheme.VividOrange,
            style: {
                fontSize: 12,
            },
            precision: 0,
            numericFormat: ENumericFormat.Engineering,
            verticalTextPosition: EVerticalTextPosition.Above,
            horizontalTextPosition: EHorizontalTextPosition.Right,
        },
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);

    // Adjust the size of the custom texture so it scales as you zoom
    sciChartSurface.layoutMeasured.subscribe((data) => {
        const width = xAxis.getCurrentCoordinateCalculator().getCoordWidth(5);
        const height = yAxis.getCurrentCoordinateCalculator().getCoordWidth(10000000);
        if (
            width !== rectangleSeries.customTextureOptions.textureWidth ||
            height !== rectangleSeries.customTextureOptions.textureHeight
        ) {
            rectangleSeries.customTextureOptions = new StickFigureTextureOptions({
                stroke: appTheme.MutedBlue,
                repeat: true,
                textureWidth: width,
                textureHeight: height,
            });
        }
    });

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};
