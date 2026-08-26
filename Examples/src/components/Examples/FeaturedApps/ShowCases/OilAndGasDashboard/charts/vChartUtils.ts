import { TModifierDefinition } from "scichart/Builder/types/ModifierDefinitions";
import { ISciChart2DDefinition } from "scichart/Builder/types/SurfaceDefinitions";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAxisType } from "scichart/types/AxisType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { EXyDirection } from "scichart/types/XyDirection";
import { registerAllTypes } from "scichart/Builder/register/all";

// The Builder API is lean by default in v6. The definitions below name their types as
// strings, so register the built-in types for every chart in this dashboard
registerAllTypes();

export const getDataRows = async (filename: string) => {
    const fileData = await fetch(filename);
    const text = await fileData.text();
    return text.split("\n");
};

export const getParsedData = async (source: string) => {
    const rows = await getDataRows(source);
    return rows.reduce((acc: number[][], row: string) => {
        const data = row.replace(",", ".").split(";");

        const x = Number.parseFloat(data[0]);
        if (!isNaN(x)) {
            acc.push(data.map((value) => Number.parseFloat(value)));
        }

        return acc;
    }, []);
};

export const getCommonChartConfigs = (axisTitle: string): ISciChart2DDefinition => ({
    surface: {
        padding: Thickness.fromNumber(0),
        theme: { type: EThemeProviderType.Dark },
    },
    xAxes: {
        type: EAxisType.NumericAxis,
        options: {
            axisAlignment: EAxisAlignment.Left,
            drawLabels: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            autoRange: EAutoRange.Once,
            visibleRangeLimit: new NumberRange(0, 1000),
        },
    },
    yAxes: {
        type: EAxisType.NumericAxis,
        options: {
            axisTitle,
            axisTitleStyle: { fontSize: 12 },
            axisAlignment: EAxisAlignment.Bottom,
            flippedCoordinates: true,
            drawLabels: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            autoRange: EAutoRange.Once,
        },
    },
});

export const getCommonChartModifiersConfig = (yAxisId: string): TModifierDefinition[] => [
    {
        type: EChart2DModifierType.ZoomExtents,
        options: {
            modifierGroup: "VerticalChartsGroup",
            xyDirection: EXyDirection.XDirection,
        },
    },
    {
        type: EChart2DModifierType.ZoomPan,
        options: {
            modifierGroup: "VerticalChartsGroup",
            excludedYAxisIds: [yAxisId],
        },
    },
    {
        type: EChart2DModifierType.ZoomPan,
        options: {
            modifierGroup: "VerticalChartsGroup",
            xyDirection: EXyDirection.XDirection,
        },
    },
    {
        type: EChart2DModifierType.MouseWheelZoom,
        options: {
            modifierGroup: "VerticalChartsGroup",
            excludedYAxisIds: [yAxisId],
            xyDirection: EXyDirection.XDirection,
        },
    },
];
