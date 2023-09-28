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
    IRenderableSeries,
    DataPointSelectionModifier,
    TTextStyle,
    TextureManager,
} from 'scichart';
import { CN, IN, US, JP, DE, GB, FR, BR, CA, AU } from 'country-flag-icons/string/3x2';
import { appTheme } from 'scichart-example-dependencies';
import { TDataEntry, availableLocations, getData, getRequestsNumberPerLocation } from './data-generation';
import { TChartConfigFunc } from './chart-configurations';
import { TTextureObject } from 'scichart/Charting/Visuals/TextureManager/TextureManager';

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
    '#FF0000',
    '#FF7E00',
    '#0052CC',
    '#D32F2F',
    '#006400',
    '#3333FF',
    '#0055A4',
    '#00A859',
    '#FF0000',
    '#FFD700',
];
const regionStrokeColors = [
    '#FF0000',
    '#FF7E00',
    '#0052CC',
    '#D32F2F',
    '#006400',
    '#3333FF',
    '#0055A4',
    '#00A859',
    '#FF0000',
    '#FFD700',
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
        const finalOpacity = metadata.isSelected ? 1 : opacity;
        return parseColorToUIntArgb(regionFillColors[index], finalOpacity * 255);
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        const finalOpacity = metadata.isSelected ? 1 : opacity;
        return parseColorToUIntArgb(regionStrokeColors[index], finalOpacity * 255);
    }
}

// location stats
export const createChart5: TChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
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
        axisTitle: 'Requests per location',
        axisTitleStyle: {
            fontSize: 18,
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
        metadata: xValues.map(() => ({ isSelected: false })),
    });

    // filtered per location
    const rendSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries,
        fill: AUTO_COLOR,
        stroke: AUTO_COLOR,
        paletteProvider: new CustomColumnPaletteProvider(),
        strokeThickness: 2,
        // cornerRadius: 50,
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
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true }),
        onHoveredChanged: (sourceSeries: IRenderableSeries, isHovered: boolean) => {
            sourceSeries.opacity = isHovered ? 1 : 0.6;
        },
    });
    sciChartSurface.renderableSeries.add(rendSeries);

    const dataPointSelectionModifier = new DataPointSelectionModifier({ id: 'DataPointSelectionModifier' });
    sciChartSurface.chartModifiers.add(dataPointSelectionModifier);

    sciChartSurface.zoomExtentsY();

    const updateData = (newData: TDataEntry[]) => {
        const { xValues, yValues } = getRequestsNumberPerLocation(newData);
        const oldDataSeries = rendSeries.dataSeries as XyDataSeries;

        const newDataSeries = new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            metadata: xValues.map((_, index) => oldDataSeries.getMetadataAt(index)),
        });

        rendSeries.dataSeries = newDataSeries;
        oldDataSeries.delete();
    };
    return { sciChartSurface, updateData };
};

export const createChart3: TChartConfigFunc<SciChartPieSurface> = async (divElementId: string | HTMLDivElement) => {
    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,

        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 1,
        showLegend: true,
        showLegendSeriesMarkers: true,
        animateLegend: true,
    });
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
    // const radiusSize = [1, 1, 1, 1];

    const toPieSegment = (name: string, value: number, radiusAdjustment: number, color1: string, color2?: string) => {
        return new PieSegment({
            value,
            text: name,
            labelStyle: { color: appTheme.ForegroundColor, fontSize: 18 },
            radiusAdjustment,
            showLabel: value > 2,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: color1, offset: 0 },
                { color: color2 ?? color1 + '77', offset: 1 },
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
        const totalRequests = requestsPerLocation.yValues.reduce((acc, value) => acc + value, 0);

        sciChartPieSurface.pieSegments.asArray().forEach((segment, index) => {
            segment.value = (requestsPerLocation.yValues[index] * 100) / totalRequests;
        });
    };

    return { sciChartSurface: sciChartPieSurface, updateData };
};
