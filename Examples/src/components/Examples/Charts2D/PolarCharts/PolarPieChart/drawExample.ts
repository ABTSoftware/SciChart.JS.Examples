import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode,
    NumberRange,
    XyxDataSeries,
    EColumnMode,
    MetadataPaletteProvider,
    IPointMetadata,
    EColumnDataLabelPosition,
    EPolarLabelMode,
    EMultiLineAlignment,
} from "scichart";
import { appTheme } from "../../../theme";

const DATA = [
    { label: "React.js", color: appTheme.MutedBlue, value: 45.3 },
    { label: "Angular", color: appTheme.VividRed, value: 31.9 },
    { label: "Vue.js", color: appTheme.VividTeal, value: 14.2 },
    { label: "Svelte", color: appTheme.VividOrange, value: 4.8 },
    { label: "Next.js", color: appTheme.Indigo, value: 3.8 },
    { label: "Ember.js", color: appTheme.MutedRed, value: 2.1 },
];

type ICustomMetadataPoint = { label: string; fill: string; value: number } & IPointMetadata;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Most Popular JS Frameworks 2024",
        titleStyle: {
            fontSize: 24,
        },
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRangeLimit: new NumberRange(0, 1),
        startAngleDegrees: 90,
        isVisible: false,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        startAngleDegrees: 90,
        isVisible: false,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const metadata: ICustomMetadataPoint[] = [];
    const xValues: number[] = [];
    const x1Values: number[] = [];

    let cumulative = 0;
    for (let i = 0; i < DATA.length; i++) {
        xValues.push(cumulative);
        cumulative += DATA[i].value;
        x1Values.push(cumulative);
        metadata.push({
            isSelected: false,
            fill: DATA[i].color,
            label: DATA[i].label,
            value: DATA[i].value,
        });
    }

    const pieSegmentsFromColumns = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxDataSeries(wasmContext, {
            xValues: xValues,
            x1Values: x1Values,
            yValues: Array(xValues.length).fill(1),
            metadata,
        }),
        stroke: "#000000",
        strokeThickness: 2,
        columnXMode: EColumnMode.StartEnd, // each segment starts at value `x` and ends at value `x1`
        paletteProvider: new MetadataPaletteProvider(), // use colors from the metadata for each column value
        dataLabels: {
            metaDataSelector: (metadata: IPointMetadata) => {
                const label = (metadata as ICustomMetadataPoint).label;
                const value = (metadata as ICustomMetadataPoint).value;

                if (value < 5) {
                    return label + " - " + value + "%"; // keep smaller segments' label single-line
                } else {
                    return label + "\n" + value + "%";
                }
            },
            style: {
                fontSize: 18,
                multiLineAlignment: EMultiLineAlignment.Center,
                lineSpacing: 12,
            },
            color: "#FFFFFF",
            labelYPositionMode: EColumnDataLabelPosition.Inside,
            polarLabelMode: EPolarLabelMode.Perpendicular,
        },
    });
    sciChartSurface.renderableSeries.add(pieSegmentsFromColumns);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};
