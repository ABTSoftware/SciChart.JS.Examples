import {
    DefaultPaletteProvider,
    EStrokePaletteMode,
    IPointMetadata,
    parseColorToUIntArgb,
    TPointMarkerArgb,
    IOverviewOptions,
    IRenderableSeries,
    ESeriesType,
    IFastLineRenderableSeriesOptions,
    IXyScatterRenderableSeriesOptions,
    TPointMarkerDefinition,
    buildSeries,
    AxisBase2D,
    NumberRange
} from "scichart";
import { getSeriesColor } from "../../PerformanceMarkColors";
import { TCustomMetadata } from "../../data/PerformanceStatsUtils";

class CustomPaletteProvider extends DefaultPaletteProvider {
    public strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const dataPointMetadata = metadata as TCustomMetadata;
        if (dataPointMetadata?.duration) {
            const [key] = dataPointMetadata.name.split("_");
            const color = getSeriesColor(key);

            const finalOpacity = dataPointMetadata.isHovered ? 0.8 : opacity;

            return parseColorToUIntArgb(color, finalOpacity * 255);
        }
        return parseColorToUIntArgb("white", 0 * 255);
    }
    public override overridePointMarkerArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): TPointMarkerArgb {
        const dataPointMetadata = metadata as TCustomMetadata;
        const [key] = dataPointMetadata.name.split("_");
        const color = getSeriesColor(key);

        const finalOpacity = dataPointMetadata.isHovered ? 0.8 : opacity;

        return {
            stroke: parseColorToUIntArgb(color, finalOpacity * 255),
            fill: parseColorToUIntArgb(color, finalOpacity * 255)
        };
    }
}

export const overviewOptions: IOverviewOptions = {
    id: "PerformanceMonitorOverview",
    transformRenderableSeries: (rs: IRenderableSeries) => {
        if (rs.type !== ESeriesType.LineSeries && rs.type !== ESeriesType.ScatterSeries) {
            return undefined;
        }
        const definition = rs.toJSON(true);
        type TAvailableSeriesOptionsTypes = IFastLineRenderableSeriesOptions | IXyScatterRenderableSeriesOptions;
        const seriesOptions = definition.options as TAvailableSeriesOptionsTypes;
        seriesOptions.strokeThickness = 2;
        seriesOptions.dataLabelProvider = undefined;
        (seriesOptions.pointMarker as TPointMarkerDefinition).options.height = 2;
        const [overviewRs] = buildSeries(rs.parentSurface.webAssemblyContext2D, definition);
        overviewRs.dataSeries = rs.dataSeries;

        return overviewRs;
    },
    overviewXAxisOptions: {
        growBy: new NumberRange(0.01, 0.01)
    },
    overviewYAxisOptions: {
        growBy: new NumberRange(0.1, 0.1)
    }
};
