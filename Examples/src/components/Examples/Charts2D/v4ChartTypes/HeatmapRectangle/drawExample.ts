import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    FastRectangleRenderableSeries,
    EColumnYMode,
    EColumnMode,
    IPointMetadata,
    DefaultPaletteProvider,
    TSciChart,
    parseColorToUIntArgb,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    CursorModifier,
    zeroArray2D,
    XyzDataSeries,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // This function generates data for the heatmap with contours series example
    function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
        const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

        const angle = (Math.PI * 2 * index) / 30;
        let smallValue = 0;
        for (let x = 0; x < heatmapWidth; x++) {
            for (let y = 0; y < heatmapHeight; y++) {
                const v =
                    (1 + Math.sin(x * 0.04 + angle)) * 50 +
                    (1 + Math.sin(y * 0.1 + angle)) * 50 * (1 + Math.sin(angle * 2));
                const cx = heatmapWidth / 2;
                const cy = heatmapHeight / 2;
                const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
                const exp = Math.max(0, 1 - r * 0.008);
                const zValue = v * exp;
                zValues[y][x] = zValue > colorPaletteMax ? colorPaletteMax : zValue;
                zValues[y][x] += smallValue;
            }

            smallValue += 0.001;
        }

        return zValues;
    }

    function noGradientColor(
        value: number,
        min: number,
        max: number,
        gradientSteps: { offset: number; color: string }[]
    ) {
        // Normalize the value to a 0-1 range
        const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));

        // Find the appropriate color segment
        for (let i = 0; i < gradientSteps.length - 1; i++) {
            const currentStep = gradientSteps[i];
            const nextStep = gradientSteps[i + 1];

            if (normalizedValue >= currentStep.offset && normalizedValue <= nextStep.offset) {
                // If the value falls exactly on a step, return that color
                if (normalizedValue === currentStep.offset) {
                    return currentStep.color;
                }
                if (normalizedValue === nextStep.offset) {
                    return nextStep.color;
                }

                // For interpolation between colors, you could return the nearest step
                // or implement color interpolation if your colors support it
                const segmentProgress = (normalizedValue - currentStep.offset) / (nextStep.offset - currentStep.offset);

                // Return the color closer to the normalized value
                return segmentProgress < 0.5 ? currentStep.color : nextStep.color;
            }
        }

        // Fallback: return the last color if value is at maximum
        return gradientSteps[gradientSteps.length - 1].color;
    }

    function getGradientColor(
        value: number,
        min: number,
        max: number,
        gradientSteps: { offset: number; color: string }[]
    ) {
        const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));

        // Find the segment
        for (let i = 0; i < gradientSteps.length - 1; i++) {
            const currentStep = gradientSteps[i];
            const nextStep = gradientSteps[i + 1];

            if (normalizedValue >= currentStep.offset && normalizedValue <= nextStep.offset) {
                const segmentProgress = (normalizedValue - currentStep.offset) / (nextStep.offset - currentStep.offset);

                // Return interpolated color (implementation depends on your color system)
                return interpolateColors(currentStep.color, nextStep.color, segmentProgress);
            }
        }

        return gradientSteps[gradientSteps.length - 1].color;
    }

    // Helper function for color interpolation (returns hex color string)
    function interpolateColors(color1: string, color2: string, factor: number): string {
        // Parse color1 and color2 as hex strings (e.g. "#RRGGBB" or "#AARRGGBB")
        const parseHex = (hex: string) => {
            // Remove '#' if present
            hex = hex.replace(/^#/, "");
            // Support short hex
            if (hex.length === 3) {
                hex = hex
                    .split("")
                    .map((c) => c + c)
                    .join("");
            }
            // Support ARGB or RGB
            let r = 0,
                g = 0,
                b = 0;
            if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else if (hex.length === 8) {
                // ignore alpha for now
                r = parseInt(hex.substring(2, 4), 16);
                g = parseInt(hex.substring(4, 6), 16);
                b = parseInt(hex.substring(6, 8), 16);
            }
            return { r, g, b };
        };
        const c1 = parseHex(color1);
        const c2 = parseHex(color2);
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        // Return as hex string
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    class HeatmapPaletteProvider extends DefaultPaletteProvider {
        private min;
        private max;
        private gradientSteps;
        private gradient;

        private _isRangeIndependant?: boolean = true;
        public get isRangeIndependant(): boolean {
            return this._isRangeIndependant;
        }
        public set isRangeIndependant(value: boolean) {
            this._isRangeIndependant = value;
        }

        public shouldUpdatePalette(): boolean {
            return false;
        }

        constructor(
            wasmContext: TSciChart,
            minimum: number,
            maximum: number,
            gradientSteps: { offset: number; color: string }[],
            gradient: boolean
        ) {
            super();
            this.min = minimum;
            this.max = maximum;
            this.gradientSteps = gradientSteps;
            this.gradient = gradient;
        }

        public overrideFillArgb(
            xValue: number,
            yValue: number,
            index: number,
            opacity?: number,
            metadata?: IPointMetadata
        ): number | undefined {
            const value = dataSeries.getNativeZValues().get(index);

            const gradinetCalc = this.gradient
                ? getGradientColor(value, this.min, this.max, this.gradientSteps)
                : noGradientColor(value, this.min, this.max, this.gradientSteps);

            return parseColorToUIntArgb(gradinetCalc);
        }
    }

    // Add X-axis
    const xAxis = new NumericAxis(wasmContext, {
        isVisible: false,
    });

    sciChartSurface.xAxes.add(xAxis);

    // Add Y-axis
    const yAxis = new NumericAxis(wasmContext, {
        isVisible: false,
    });
    sciChartSurface.yAxes.add(yAxis);

    const heatmapWidth = 300;
    const heatmapHeight = 200;
    const colorPaletteMax = 150;

    const initialZValues = generateExampleData(3, heatmapWidth, heatmapHeight, colorPaletteMax);

    function transformData(data: number[][]) {
        const xValues = [];
        const yValues = [];

        // Iterate through each row
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];

            // For each element in the row, add corresponding x and y values
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                xValues.push(colIndex + 1); // Column index (1-based)
                yValues.push(data.length - rowIndex); // Row index from bottom (1-based)
            }
        }

        return { xValues, yValues };
    }

    const { xValues, yValues } = transformData(initialZValues);

    const flatValues = initialZValues.flat();

    const min = 0;
    const max = colorPaletteMax;
    const zValues = flatValues;

    const dataSeries = new XyzDataSeries(wasmContext, {
        xValues,
        yValues,
        zValues,
    });

    const setChart = (gradient: boolean) => {
        sciChartSurface.renderableSeries.clear(false);

        const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
            dataSeries,
            columnXMode: EColumnMode.Start,
            columnYMode: EColumnYMode.TopHeight,
            paletteProvider: new HeatmapPaletteProvider(
                wasmContext,
                min,
                max,
                [
                    { offset: 0, color: appTheme.DarkIndigo },
                    { offset: 0.2, color: appTheme.Indigo },
                    { offset: 0.3, color: appTheme.VividSkyBlue },
                    { offset: 0.5, color: appTheme.VividGreen },
                    { offset: 0.7, color: appTheme.MutedRed },
                    { offset: 0.9, color: appTheme.VividOrange },
                    { offset: 1, color: appTheme.VividPink },
                ],
                gradient
            ),
            dataPointWidth: 1,
            defaultY1: 1,
            strokeThickness: 0,
        });
        sciChartSurface.renderableSeries.add(rectangleSeries);
    };

    // true = gradient, false = solid
    setChart(true);

    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[]) => {
        const valuesWithLabels: string[] = [];

        seriesInfos.forEach((si) => {
            console.log(si);
            const xyzSI = si;
            if (xyzSI.isWithinDataBounds) {
                if (!isNaN(xyzSI.yValue) && xyzSI.isHit) {
                    const value = dataSeries.getNativeZValues().get(xyzSI.dataSeriesIndex);
                    valuesWithLabels.push(`X: ${xyzSI.xValue}, Y: ${xyzSI.yValue}, Value: ${value.toFixed(2)}`);
                }
            }
        });
        return valuesWithLabels;
    };

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new CursorModifier({
            showTooltip: true,
            tooltipDataTemplate,
            showXLine: false,
            showYLine: false,
            tooltipContainerBackground: appTheme.MutedPurple + 55,
        })
    );

    return { sciChartSurface, wasmContext, setChart };
};
