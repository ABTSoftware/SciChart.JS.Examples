import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    CursorModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    DefaultPaletteProvider,
    IPointMarkerPaletteProvider,
    parseColorToUIntArgb,
    RolloverModifier,
    ENumericFormat,
    NumberRange,
    ChartModifierBase2D,
    XySeriesInfo,
    EXyDirection,
} from "scichart";
import { appTheme } from "../../../theme";

// Helper to extract RGB channels from a UInt ARGB color
const extractColorChannels = (uintColor: number) => {
    return {
        a: (uintColor >> 24) & 0xff,
        r: (uintColor >> 16) & 0xff,
        g: (uintColor >> 8) & 0xff,
        b: uintColor & 0xff,
    };
};

class GradientPaletteProvider extends DefaultPaletteProvider implements IPointMarkerPaletteProvider {
    private readonly minY: number;
    private readonly maxY: number;
    
    // Color Channel Data
    private startColor: { r: number, g: number, b: number, a: number };
    private endColor: { r: number, g: number, b: number, a: number };

    constructor(minY: number, maxY: number, startHex: string, endHex: string) {
        super();
        this.minY = minY;
        this.maxY = maxY;

        // Pre-calculate color channels to avoid expensive parsing per point
        this.startColor = extractColorChannels(parseColorToUIntArgb(startHex));
        this.endColor = extractColorChannels(parseColorToUIntArgb(endHex));
    }

    public override overridePointMarkerArgb(xValue: number, yValue: number, index: number) {
        // Calculate the fraction (0 to 1) of the current Y value within the range
        let fraction = (yValue - this.minY) / (this.maxY - this.minY);
        if (fraction < 0) fraction = 0;
        if (fraction > 1) fraction = 1;

        // Lerp
        const r = Math.floor(this.startColor.r + (this.endColor.r - this.startColor.r) * fraction);
        const g = Math.floor(this.startColor.g + (this.endColor.g - this.startColor.g) * fraction);
        const b = Math.floor(this.startColor.b + (this.endColor.b - this.startColor.b) * fraction);
        
        // Reassemble into UInt ARGB
        const colorUint = (255 << 24) | (r << 16) | (g << 8) | b;

        return { 
            stroke: colorUint, 
            fill: colorUint 
        };
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Engineering,
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.01),
    }));

    // 1. Data Generation (Bounded Cloud)
    const count = 1_000_000;
    const xValues = new Float64Array(count);
    const yValues = new Float64Array(count);
    
    const Y_MIN = -500;
    const Y_MAX = 500;

    for(let i = 0; i < count; i++) {
        xValues[i] = i;
        yValues[i] = Y_MIN + Math.random() * (Y_MAX - Y_MIN);
    }

    // 2. Create Scatter Series with Gradient Palette
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { 
            xValues,
            yValues,
            containsNaN: false,
            isSorted: true,
            dataSeriesName: "Bounded Cloud Series"
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 1,
            height: 1,
            strokeThickness: 0.5,
        }),
        paletteProvider: new GradientPaletteProvider(
            Y_MIN, 
            Y_MAX, 
            appTheme.Indigo, // Start (Low Y)
            appTheme.VividOrange // End (High Y)
        )
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier({
            xyDirection: EXyDirection.XDirection
        })
    );

    // 3. State Management for Tool Modifiers
    let activeModifier: ChartModifierBase2D | null = null;
    let isCursorMode = true;
    let isSvgMode = true;

    const rebuildActiveModifier = () => {
        if (activeModifier) {
            sciChartSurface.chartModifiers.remove(activeModifier);
            activeModifier.delete();
            activeModifier = null;
        }

        const accentColor = "#5e7dba";

        if (isCursorMode) {
            activeModifier = new CursorModifier({
                isSvgOnly: isSvgMode,
                showTooltip: true,
                crosshairStroke: accentColor,
                axisLabelFill: accentColor,
                tooltipContainerBackground: accentColor,
            });
        } 
        else {
            activeModifier = new RolloverModifier({
                isSvgOnly: isSvgMode,
                showTooltip: true,
                showAxisLabel: true,
                rolloverLineStroke: accentColor,
                tooltipDataTemplate: (seriesInfo: XySeriesInfo): string[] => {
                    const valuesWithLabels: string[] = [];
                    const xySeriesInfo = seriesInfo as XySeriesInfo;
                    valuesWithLabels.push(`X: ${xySeriesInfo.formattedXValue}`);
                    valuesWithLabels.push(`Y: ${xySeriesInfo.formattedYValue}`);
                    return valuesWithLabels;
                }
            });
            (activeModifier as RolloverModifier).rolloverLineAnnotation.axisLabelFill = accentColor;
        }

        sciChartSurface.chartModifiers.add(activeModifier);
    };
    rebuildActiveModifier();

    // 4. Control Functions
    const setSvgMode = (useSvg: boolean) => {
        isSvgMode = useSvg;
        rebuildActiveModifier();
    };
    const toggleUseCursorOrRollover = (useCursor: boolean) => {
        isCursorMode = useCursor;
        rebuildActiveModifier();
    };

    return { 
        sciChartSurface, 
        controls: { 
            setSvgMode,
            toggleUseCursorOrRollover
        } 
    };
};