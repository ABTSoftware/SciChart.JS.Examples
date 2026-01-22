import {
    AnnotationDragDeltaEventArgs,
    BaseValueAxis,
    CoordinateCalculatorBase,
    CursorModifier,
    ELabelPlacement,
    EllipsePointMarker,
    EXyDirection,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    VerticalLineAnnotation,
    XDataSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { appTheme } from "../../../theme";

/**
 * Generate baseValues for a non-linear scale based on a power law
 * @param visibleRange The visible range to generate values for
 * @param base The base for the power law (e.g., 10 for powers of 10)
 * @returns An array of values based on the power law, including zero if in range
 */
const generatePowerLawBaseValues = (
    visibleRange: NumberRange,
    base: number = 10,
    minimumPower: number = 1
): number[] => {
    const baseValues: number[] = [];

    // Generate negative powers
    if (visibleRange.min < 0) {
        const lowPower = Math.ceil(Math.log(Math.abs(visibleRange.min)) / Math.log(base));
        const max =
            visibleRange.max >= 0 ? minimumPower : Math.floor(Math.log(Math.abs(visibleRange.max)) / Math.log(base));
        for (let power = lowPower; power >= minimumPower; power--) {
            const value = -Math.pow(base, power);
            baseValues.push(value);
        }
    }

    // Add zero if it's within the range
    if (visibleRange.min <= 0 && visibleRange.max >= 0) {
        baseValues.push(0);
    }

    // Generate positive powers
    if (visibleRange.max > 0) {
        const highPower = Math.ceil(Math.log(Math.abs(visibleRange.max)) / Math.log(base));
        const min =
            visibleRange.min <= 0 ? minimumPower : Math.floor(Math.log(Math.abs(visibleRange.min)) / Math.log(base));
        for (let power = minimumPower; power <= highPower; power++) {
            const value = Math.pow(base, power);
            baseValues.push(value);
        }
    }
    return baseValues;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new BaseValueAxis(wasmContext, {
        id: "BaseValueAxis",
        visibleRange: new NumberRange(-0.1, 10.1),
        flippedCoordinates: false,
        labelPrecision: 3,
        cursorLabelPrecision: 2,
        baseValues: [0, 1, 2, 3, 4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 6, 7, 8, 9, 10],
        // autoTicks: true,
        // majorDelta: 10,
        // minorDelta: 2,
        // labelProvider: new NumericLabelProvider()
    });
    sciChartSurface.xAxes.add(xAxis);
    const baseXValues = xAxis.getBaseValues() as XDataSeries;

    // Generate baseYValues using power law with base 10
    const initialVisibleRange = new NumberRange(-500, 500);
    const powerLawBase = 10;
    const baseYValueSeries = new XDataSeries(wasmContext, {
        xValues: generatePowerLawBaseValues(initialVisibleRange, powerLawBase),
    });

    const yAxis = new BaseValueAxis(wasmContext, {
        visibleRange: initialVisibleRange,
        minorsPerMajor: 9,
        baseValues: baseYValueSeries,
        autoTicks: false,
    });
    yAxis.visibleRangeChanged.subscribe((data) => {
        baseYValueSeries.clear();
        baseYValueSeries.appendRange(
            generatePowerLawBaseValues(yAxis.visibleRange.union(initialVisibleRange), powerLawBase)
        );
    });

    yAxis.tickProvider.getMajorTicks = (
        minorDelta: number,
        majorDelta: number,
        visibleRange: NumberRange,
        coordCalc?: CoordinateCalculatorBase
    ) => {
        const ticks = generatePowerLawBaseValues(visibleRange, powerLawBase);
        return ticks;
    };

    yAxis.tickProvider.getMinorTicks = (
        minorDelta: number,
        majorDelta: number,
        visibleRange: NumberRange,
        coordCalc?: CoordinateCalculatorBase
    ) => {
        const majors = generatePowerLawBaseValues(visibleRange, powerLawBase);
        const minors: number[] = [];
        for (let i = 0; i < majors.length - 1; i++) {
            const cur = majors[i];
            const next = majors[i + 1];
            const mpm = yAxis.minorsPerMajor + (next === 0 || cur === 0 ? 1 : 0);
            const step = (next - cur) / mpm;
            for (let j = 1; j < mpm; j++) {
                minors.push(cur + step * j);
            }
        }
        return minors;
    };

    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "white",
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            strokeThickness: 0,
            fill: "steelblue",
            stroke: "LightSteelBlue",
        }),
    });

    lineSeries.rolloverModifierProps.tooltipTextColor = "black";

    sciChartSurface.renderableSeries.add(lineSeries);

    const { xValues, yValues } = ExampleDataProvider.getNoisySinewave(1000, 10, 10, 150, 20);
    lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues: xValues, yValues });

    // We use a hidden numeric axis synced to the BaseValue x axis to position the vertical line
    const linearXAxis = new NumericAxis(wasmContext, {
        isVisible: false,
        visibleRange: xAxis.visibleRange,
    });
    sciChartSurface.xAxes.add(linearXAxis);
    xAxis.visibleRangeChanged.subscribe((data) => (linearXAxis.visibleRange = data.visibleRange));

    const magnifierAnnotation = new VerticalLineAnnotation({
        xAxisId: linearXAxis.id,
        x1: 5,
        stroke: appTheme.MutedOrange,
        strokeThickness: 3,
        labelValue: "Drag Me!",
        showLabel: true,
        labelPlacement: ELabelPlacement.Top,
        isEditable: true,
        onDrag: (args: AnnotationDragDeltaEventArgs) => {
            // Update the BaseValues adding more points around the annotation x coordinate, effectively zooming in that area and compressing elsewhere
            const newBaseValues: number[] = [];
            for (let x = 0; x <= 10; x++) {
                if (x < args.sender.x1 - 0.5 || x > args.sender.x1 + 0.5) {
                    newBaseValues.push(x);
                } else {
                    for (let d = -0.5; d <= 0.5; d += 0.1) {
                        newBaseValues.push(args.sender.x1 + d);
                    }
                }
            }
            baseXValues.clear();
            baseXValues.appendRange(newBaseValues);
        },
    });

    sciChartSurface.annotations.add(magnifierAnnotation);

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ xyDirection: EXyDirection.XyDirection, includedXAxisIds: [xAxis.id] })
    );
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({ includedXAxisIds: [xAxis.id] }));
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ includedXAxisIds: [xAxis.id] }));
    sciChartSurface.chartModifiers.add(new CursorModifier({ showAxisLabels: true }));

    return { sciChartSurface, wasmContext };
};
