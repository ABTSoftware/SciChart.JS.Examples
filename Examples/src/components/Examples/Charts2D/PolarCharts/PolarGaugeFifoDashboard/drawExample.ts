import {
    Rect,
    XyDataSeries,
    PolarNumericAxis,
    EPolarAxisMode,
    NumberRange,
    EAxisAlignment,
    SciChartSurface,
    SciChartPolarSubSurface,
    ECoordinateMode,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    SciChartSubSurface,
    NumericAxis,
    FastLineRenderableSeries,
    DateTimeNumericAxis,
    NativeTextAnnotation,
    PolarArcAnnotation,
    Thickness,
    EAutoRange,
} from "scichart";
import { appTheme } from "../../../theme";

const drawGaugeSubchart = async (
    parentSurface: SciChartSurface,
    gaugeOptions: {
        startValue: number;
        position: Rect;
    }
) => {
    const { startValue, position } = gaugeOptions;

    // Create the SciChartPolarSubSurface
    const sciChartSurface = SciChartPolarSubSurface.createSubSurface(parentSurface, {
        padding: new Thickness(0, 10, 10, 10),
        position: position,
        background: "transparent",
        loader: false,
    });

    // Constants that won't change
    const gaugeRange = new NumberRange(0, 10);
    const gradientColors = [appTheme.VividGreen, appTheme.VividOrange, appTheme.VividPink];
    const columnYValues = [5, 7.5, 10];

    // Pre-calculate the color thresholds
    const colorThresholds = columnYValues.map((val, i) => ({
        threshold: val,
        color: gradientColors[i],
    }));

    const radialXAxis = new PolarNumericAxis(parentSurface.webAssemblyContext2D, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawLabels: false,
    });
    sciChartSurface.xAxes.add(radialXAxis);

    const angularYAxis = new PolarNumericAxis(parentSurface.webAssemblyContext2D, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: gaugeRange,
        zoomExtentsToInitialRange: true,
        flippedCoordinates: true,
        totalAngle: Math.PI * 1.4,
        startAngle: -Math.PI * 0.2,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawLabels: false,
    });
    sciChartSurface.yAxes.add(angularYAxis);

    // gray background arc
    const backgroundArc = new PolarArcAnnotation({
        x2: 7,
        x1: 9.4,
        y1: gaugeRange.min,
        y2: gaugeRange.max,
        fill: "#88888822",
        strokeThickness: 0,
    });
    sciChartSurface.annotations.add(backgroundArc);

    // Add 3 thin arc sectors
    columnYValues.forEach((yVal, i) => {
        const thinArc = new PolarArcAnnotation({
            x2: 9.7,
            x1: 10,
            y1: columnYValues[i - 1] ?? 0,
            y2: yVal,
            fill: gradientColors[i],
            strokeThickness: 0,
        });
        sciChartSurface.annotations.add(thinArc);
    });

    // Initial color calculation
    const getColorForValue = (value: number) => {
        const threshold = colorThresholds.find((t) => value <= t.threshold);
        return threshold ? threshold.color : gradientColors[gradientColors.length - 1];
    };

    const initialColor = getColorForValue(startValue);

    const valueArc = new PolarArcAnnotation({
        id: "value_arc",
        x2: 7,
        x1: 9.4,
        y1: gaugeRange.min,
        y2: startValue,
        fill: initialColor,
        strokeThickness: 0,
    });
    sciChartSurface.annotations.add(valueArc);

    const centeredText = new NativeTextAnnotation({
        text: `${startValue.toFixed(2)}`,
        x1: 0,
        y1: 0,
        textColor: initialColor,
        fontSize: 45,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    });
    sciChartSurface.annotations.add(centeredText);

    function animateGaugeArc(from: number, to: number, steps = 10) {
        const step = (to - from) / steps;
        let currentValue = from;

        for (let i = 0; i <= steps; i++) {
            setTimeout(() => {
                valueArc.y2 = currentValue;
                currentValue += step;
            }, i * 16.67); // ~60 FPS
        }
    }

    // Optimized update function
    function updateGaugeValue(newVal: number) {
        // Only update if value actually changed
        if (valueArc.y2 !== newVal) {
            const newColor = getColorForValue(newVal);

            // Only update color if it changed
            if (valueArc.fill !== newColor) {
                valueArc.fill = newColor; // todo: fix
                valueArc.stroke = newColor;
                valueArc.invalidateParentCallback();
                centeredText.textColor = newColor;
            }

            centeredText.text = `${newVal.toFixed(2)}`;

            // Animate the arc
            animateGaugeArc(valueArc.y2, newVal);
        }
    }

    return {
        sciChartSurface,
        controls: {
            updateGaugeValue,
        },
    };
};

const drawFifoSubchart = async (
    parentSurface: SciChartSurface,
    options: {
        position: Rect;
        seriesColor: string;
    }
) => {
    const { position, seriesColor } = options;

    const fifoSubchart1 = SciChartSubSurface.createSubSurface(parentSurface, {
        theme: appTheme.SciChartJsTheme,
        position: position,
    });

    fifoSubchart1.xAxes.add(
        new DateTimeNumericAxis(parentSurface.webAssemblyContext2D, {
            visibleRange: new NumberRange(Date.now(), Date.now() + 12000), // 1 minute range
            autoRange: EAutoRange.Always,
        })
    );
    const yAxis = new NumericAxis(parentSurface.webAssemblyContext2D, {
        labelPrecision: 0,
        visibleRange: new NumberRange(-1, 11),
    });
    fifoSubchart1.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(parentSurface.webAssemblyContext2D, {
        xValues: [],
        yValues: [],
        fifoCapacity: 100,
        dataSeriesName: "FIFO Data Series",
    });

    const fifoSeries1 = new FastLineRenderableSeries(parentSurface.webAssemblyContext2D, {
        dataSeries: dataSeries,
        stroke: seriesColor,
        strokeThickness: 3,
    });
    fifoSubchart1.renderableSeries.add(fifoSeries1);

    return {
        sciChartSurface: fifoSubchart1,
        controls: {
            appendData: (x: number, y: number) => {
                dataSeries.append(x, y);
            },
        },
    };
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Polar Subchart 1
    const { sciChartSurface: p1Sub, controls: p1Controls } = await drawGaugeSubchart(sciChartSurface, {
        startValue: 8.2,
        position: new Rect(0, 0, 0.4, 0.5),
    });

    // Polar Subchart 2
    const { sciChartSurface: p2Sub, controls: p2Controls } = await drawGaugeSubchart(sciChartSurface, {
        startValue: 4.2,
        position: new Rect(0, 0.5, 0.4, 0.5),
    });

    // Cartesian Subchart 1
    const { sciChartSurface: f1Sub, controls: f1Controls } = await drawFifoSubchart(sciChartSurface, {
        position: new Rect(0.4, 0, 0.6, 0.5),
        seriesColor: appTheme.VividPink,
    });

    // Cartesian Subchart 2
    const { sciChartSurface: f2Sub, controls: f2Controls } = await drawFifoSubchart(sciChartSurface, {
        position: new Rect(0.4, 0.5, 0.6, 0.5),
        seriesColor: appTheme.VividTeal,
    });

    let lastX = Date.now();
    let lastY = 0;

    // Mock data updates
    setInterval(() => {
        const x = (lastX += 100);
        const y = Math.min(Math.max((lastY += Math.random() * 2 - 1), 0), 10); // clamp random walk between 0 and 10
        lastY = y;

        p1Controls.updateGaugeValue(y);
        p2Controls.updateGaugeValue(10 - y);

        f1Controls.appendData(x, y);
        f2Controls.appendData(x, 10 - y);
    }, 100); // 10 appends per second

    return { sciChartSurface, wasmContext };
};
