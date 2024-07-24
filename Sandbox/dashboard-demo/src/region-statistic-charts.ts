import {
    SciChartSurface,
    TextLabelProvider,
    NumericAxis,
    NumberRange,
    StackedColumnCollection,
    XyDataSeries,
    FastColumnRenderableSeries,
    AUTO_COLOR,
    Thickness,
    WaveAnimation,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    SciChartPieSurface,
    EPieType,
    ELegendOrientation,
    ELegendPlacement,
    PieSegment,
    GradientParams,
    Point,
    BasePaletteProvider,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IPointMetadata,
    IStrokePaletteProvider,
    parseColorToUIntArgb,
    DataPointSelectionModifier,
    TTextStyle,
    TextureManager,
    SeriesSelectionModifier,
    HoveredChangedArgs,
    DataPointSelectionChangedArgs,
    IPieSegment,
} from 'scichart';
import { CN, IN, US, JP, DE, GB, FR, BR, CA, AU } from 'country-flag-icons/string/3x2';
import { appTheme } from 'scichart-example-dependencies';
import { TDataEntry, availableLocations, getData, getRequestsNumberPerLocation } from './data-generation';
import { TChartConfigFunc, TChartConfigResult } from './chart-configurations';
import { TTextureObject } from 'scichart/Charting/Visuals/TextureManager/TextureManager';
import { TInitFunction } from 'scichart-react';

type TCustomMetadata = IPointMetadata & {
    isHovered: boolean;
};

const createImageFromSvgString = async (svg: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        let blob = new Blob([svg], { type: 'image/svg+xml' });
        let url = URL.createObjectURL(blob);
        let image = document.createElement('img');
        image.src = url;
        image.addEventListener(
            'load',
            () => {
                URL.revokeObjectURL(url);
                resolve(image);
            },
            { once: true }
        );
    });
};

const getIcons = () => {
    const icons = [CN, IN, US, JP, DE, GB, FR, BR, CA, AU].map(async (svg) => {
        const icon = createImageFromSvgString(svg);

        return icon;
    });

    return Promise.all(icons);
};

const regionFillColors = [
    '#c43360',
    '#47bde6',
    '#ae418d',
    '#34c19c',
    '#e97064',
    '#274b92',
    '#634e96',
    '#0bdef4',
    '#f6086c',
    '#68bcae',
];
const regionStrokeColors = [
    '#c43360',
    '#47bde6',
    '#ae418d',
    '#34c19c',
    '#e97064',
    '#274b92',
    '#634e96',
    '#0bdef4',
    '#f6086c',
    '#68bcae',
];

class CustomColumnPaletteProvider extends BasePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const dataPointMetadata = metadata as TCustomMetadata;
        const finalOpacity = metadata.isSelected ? 1 : dataPointMetadata.isHovered ? 0.8 : opacity;
        return parseColorToUIntArgb(regionFillColors[index], finalOpacity * 255);
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const dataPointMetadata = metadata as TCustomMetadata;
        const finalOpacity = metadata.isSelected ? 1 : dataPointMetadata.isHovered ? 0.8 : opacity;
        return parseColorToUIntArgb(regionStrokeColors[index], finalOpacity * 255);
    }
}

export type TLocationStatsChartConfigFuncResult = TChartConfigResult<SciChartSurface> & {
    subscribeToLocationSelection: (callback: (value: string) => void) => void;
};
export type TLocationStatsChartConfigFunc = TInitFunction<SciChartSurface, TLocationStatsChartConfigFuncResult>;

// location stats
export const createRegionStatisticsColumnChart: TLocationStatsChartConfigFunc = async (
    divElementId: string | HTMLDivElement
) => {
    const icons = await getIcons();

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
    });

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-1, availableLocations.length),
        // visibleRangeLimit: new NumberRange(0, availableLocations.length),
        growBy: new NumberRange(0.1, 0.1),
        autoTicks: false,
        majorDelta: 1,
    });

    // Required to stop these country textures showing up on other charts
    xAxis.labelProvider.useSharedCache = false;
    xAxis.labelProvider.getLabelTexture = (
        labelText: string,
        textureManager: TextureManager,
        labelStyle: TTextStyle
    ): TTextureObject => {
        const index = Number.isInteger(Number.parseFloat(labelText)) ? Number.parseFloat(labelText) : NaN;
        if (!isNaN(index)) {
            const icon = icons[index];
            if (icon) {
                return textureManager.createTextureFromImage(icon, 30, 20);
            }
        }
        return textureManager.createTextTexture([''], labelStyle);
    };

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 18,
            color: appTheme.ForegroundColor,
        },
        labelStyle: {
            color: appTheme.ForegroundColor,
        },
        labelPrecision: 0,
        growBy: new NumberRange(0.05, 0.25),
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const data = getData();

    const { xValues, yValues } = getRequestsNumberPerLocation(data);

    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata: xValues.map(() => ({ isSelected: false, isHovered: false })),
        containsNaN: false,
        isSorted: true,
        dataEvenlySpacedInX: true,
    });

    // filtered per location
    const rendSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: AUTO_COLOR,
        stroke: AUTO_COLOR,
        paletteProvider: new CustomColumnPaletteProvider(),
        strokeThickness: 2,
        opacity: 0.6,
        dataLabels: {
            precision: 0,
            style: {
                padding: Thickness.fromString('6 0 6 0'),
                fontFamily: 'Arial',
                fontSize: 18,
            },
            color: appTheme.ForegroundColor,
        },
        animation: new WaveAnimation({ duration: 1000, fadeEffect: false }),
    });
    sciChartSurface.renderableSeries.add(rendSeries);

    const dataPointSelectionModifier = new DataPointSelectionModifier({
        id: 'DataPointSelectionModifier',
        allowDragSelect: false,
    });

    let lastSelectedDataPointIndex = -1;
    const onHoverChanged = (args: HoveredChangedArgs) => {
        if (args.hoveredSeries.length === 0 && lastSelectedDataPointIndex >= 0) {
            const yValue = dataSeries.getNativeYValues().get(lastSelectedDataPointIndex);
            const metadata = dataSeries.getMetadataAt(lastSelectedDataPointIndex) as TCustomMetadata;
            metadata.isHovered = false;
            dataSeries.update(lastSelectedDataPointIndex, yValue, metadata);
            lastSelectedDataPointIndex = -1;
        } else if (args.hoveredSeries.length > 0 && args.hitTestInfo) {
            const yValue = dataSeries.getNativeYValues().get(args.hitTestInfo.dataSeriesIndex);
            const metadata = dataSeries.getMetadataAt(args.hitTestInfo.dataSeriesIndex) as TCustomMetadata;
            metadata.isHovered = true;
            dataSeries.update(args.hitTestInfo.dataSeriesIndex, yValue, metadata);
            lastSelectedDataPointIndex = args.hitTestInfo.dataSeriesIndex;
        }
    };

    const seriesSelectionModifier = new SeriesSelectionModifier({
        enableHover: true,
        enableSelection: false,
        onHoverChanged,
    });
    sciChartSurface.chartModifiers.add(dataPointSelectionModifier, seriesSelectionModifier);

    sciChartSurface.zoomExtentsY();

    const updateData = (newData: TDataEntry[]) => {
        const { xValues, yValues } = getRequestsNumberPerLocation(newData);
        const dataSeries = rendSeries.dataSeries as XyDataSeries;
        const metadata = xValues.map((_, index) => dataSeries.getMetadataAt(index));
        dataSeries.clear();
        dataSeries.appendRange(xValues, yValues, metadata);
    };

    const subscribeToLocationSelection = (callback: (location: string) => void) => {
        dataPointSelectionModifier.selectionChanged.subscribe((data: DataPointSelectionChangedArgs) => {
            const [dataPoint] = data.selectedDataPoints;
            const selectedLocation = availableLocations[dataPoint?.xValue];
            callback(selectedLocation);
        });
    };

    return { sciChartSurface, updateData, subscribeToLocationSelection };
};

export const createRegionStatisticsPieChart: TChartConfigFunc<SciChartPieSurface> = async (
    divElementId: string | HTMLDivElement
) => {
    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,

        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 1,
        showLegend: false,
        showLegendSeriesMarkers: true,
        animateLegend: true,
    });
    sciChartPieSurface.labelRadiusAdjustment = 1.7;
    // Optional placement of legend
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
    sciChartPieSurface.legend.placement = ELegendPlacement.BottomRight;
    const data = getData();

    const requestsPerLocation = getRequestsNumberPerLocation(data);
    const totalRequests = requestsPerLocation.yValues.reduce((acc, value) => acc + value, 0);

    const dataset = requestsPerLocation.xValues.map((value, index) => {
        return {
            name: availableLocations[index],
            percent: (requestsPerLocation.yValues[index] * 100) / totalRequests,
        };
    });

    // Colors are just hex strings, supporting #FFFFFF (RBG) or 8-digit with RGBA or CSS color strings e.g. rgba()
    const colors = dataset.map((_, index) => ({
        color1: regionFillColors[index],
        color2: regionStrokeColors[index],
    }));

    // Optional Relative radius adjustment per segment
    const radiusSize = [1, 0.9, 0.95, 0.9, 0.85, 0.85, 0.85, 0.9, 0.9, 0.9, 0.95, 0.95, 0.95, 0.95, 0.95];
    sciChartPieSurface.labelProvider.getSegmentText = (segment: IPieSegment, total) =>
        `<span>${segment.text}<span><span> ${segment.getPercentage(total).toFixed(1)}%</span>`;
    const toPieSegment = (name: string, value: number, radiusAdjustment: number, color1: string, color2?: string) => {
        return new PieSegment({
            value,
            text: name,
            labelStyle: { color: appTheme.ForegroundColor, fontSize: 12 },
            radiusAdjustment,
            showLabel: true,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: color1, offset: 0 },
                { color: (color2 ?? color1) + '77', offset: 1 },
            ]),
        });
    };

    // Transform the data to pie segment and add to scichart
    const pieSegments = dataset.map((row, index) =>
        toPieSegment(row.name, row.percent, radiusSize[index], colors[index].color1, colors[index].color2)
    );

    sciChartPieSurface.pieSegments.add(...pieSegments);

    const updateData = (newData: TDataEntry[]) => {
        const requestsPerLocation = getRequestsNumberPerLocation(newData);
        const totalRequests = requestsPerLocation.yValues.reduce((acc, value) => acc + value, 0) || 1;

        sciChartPieSurface.pieSegments.asArray().forEach((segment, index) => {
            segment.value = (requestsPerLocation.yValues[index] * 100) / totalRequests;
        });
    };

    return { sciChartSurface: sciChartPieSurface, updateData };
};
