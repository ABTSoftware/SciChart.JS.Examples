import { TModifierDefinition } from "scichart/Builder/buildModifiers";
import { ISciChart2DDefinition } from "scichart/Builder/buildSurface";
import { AxisCore } from "scichart/Charting/Visuals/Axis/AxisCore";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAxisType } from "scichart/types/AxisType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { EThemeProviderType } from "scichart/types/ThemeProviderType";
import { EXyDirection } from "scichart/types/XyDirection";

export const getDataRows = async (filename: string) => { 
    const fileData = await fetch(filename);
    const text = await fileData.text();
    return text.split("\n");
};

export const getParsedData = async (source: string) => {
    const rows = await getDataRows(source);
    return rows.reduce((acc: number[][], row: string) => {
        const data = row.replace(',', '.').split(';');

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
        }
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
        }
    }
});

export const getCommonChartModifiersConfig = (): TModifierDefinition[] => ([
    { type: EChart2DModifierType.ZoomExtents, options: { modifierGroup: "VerticalChartsGroup", xyDirection: EXyDirection.XDirection } },
    // TODO: Uncomment after v2.1 scichart.js release
    // { type: EChart2DModifierType.ZoomPan, options: { modifierGroup: "VerticalChartsGroup", excludedYAxisIds: [AxisCore.DEFAULT_AXIS_ID] } },
    { type: EChart2DModifierType.ZoomPan, options: { modifierGroup: "VerticalChartsGroup" } },
    {
        type: EChart2DModifierType.MouseWheelZoom, options: {
            modifierGroup: "VerticalChartsGroup",
            excludedYAxisIds: [AxisCore.DEFAULT_AXIS_ID],
            xyDirection: EXyDirection.XDirection,
        }
    },
]);
