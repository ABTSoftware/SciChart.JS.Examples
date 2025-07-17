import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    IFillPaletteProvider,
    EFillPaletteMode,
    EStrokePaletteMode,
    IPointMetadata,
    parseColorToUIntArgb,
    IStrokePaletteProvider,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    SeriesSelectionModifier,
    EDataLabelSkipMode,
    EMultiLineAlignment,
    FastRectangleRenderableSeries,
    EResamplingMode,
    EColumnMode,
    EColumnYMode,
    XyxyDataSeries,
    RectangleSeriesDataLabelProvider,
    IRectangleSeriesDataLabelProviderOptions,
    formatNumber,
    ENumericFormat,
} from "scichart";
import { appTheme } from "../../../theme";

import { stratify, treemap } from "d3-hierarchy";
// choose in between one of the two
// const d3 = require("./d3-hierarchy.js");

type RectangluarNode = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    data: TTreemapDataItem;
};

type TTreemapDataItem = {
    /**
     * Unique name of the company
     */
    name: string;
    /**
     * Short name of the company - optional
     */
    shortName?: string;
    /**
     * Parent node name
     */
    parent: string;
    /**
     * Number of Billions the company is worth
     */
    value: number;
    /**
     * Percentage gained / lost in the selected period
     */
    progress?: number;
};

/**
 * PaletteProvider for the {@link TreemapRenderableSeries} to manage the colors of rectangles
 */
class StockTreemapPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;

    private _red: number = parseColorToUIntArgb(appTheme.VividRed);
    private _green: number = parseColorToUIntArgb(appTheme.VividGreen);
    private _gray: number = 0x404040;

    private _minValue: number = -20;
    private _maxValue: number = 20;

    constructor({ minValue, maxValue }: { minValue: number; maxValue: number }) {
        this._minValue = minValue ?? this._minValue;
        this._maxValue = maxValue ?? this._maxValue;
    }

    public onAttached(): void {}
    public onDetached(): void {}

    public overrideFillArgb(
        _xValue: number,
        _yValue: number,
        _index: number,
        _opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const percentage = (metadata as unknown as TTreemapDataItem).progress;

        // Handle 0% case explicitly to avoid division issues
        if (percentage === 0) return this._gray;

        let t: number;
        let startColor: number;
        let endColor: number;

        if (percentage > 0) {
            t = Math.min(percentage / this._maxValue, 1);
            startColor = this._gray;
            endColor = this._green;
        } else {
            t = Math.min(percentage / this._minValue, 1);
            startColor = this._gray;
            endColor = this._red;
        }

        // Extract ARGB components from colors
        const getComponents = (color: number) => ({
            a: (color >>> 24) & 0xff,
            r: (color >>> 16) & 0xff,
            g: (color >>> 8) & 0xff,
            b: color & 0xff,
        });

        const start = getComponents(startColor);
        const end = getComponents(endColor);

        // Interpolate each component
        const interp = (s: number, e: number) => Math.round(s + (e - s) * t);
        const a = interp(start.a, end.a);
        const r = interp(start.r, end.r);
        const g = interp(start.g, end.g);
        const b = interp(start.b, end.b);

        // Recombine to ARGB
        return (a << 24) | (r << 16) | (g << 8) | b;
    }

    public overrideStrokeArgb(
        _xValue: number,
        _yValue: number,
        _index: number,
        _opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const fill = this.overrideFillArgb(_xValue, _yValue, _index, _opacity, metadata);

        if (fill) {
            const brightnessFactor = 1.6;
            // Extract RGB components
            let r = (fill >> 16) & 0xff;
            let g = (fill >> 8) & 0xff;
            let b = fill & 0xff;
            // Increase brightness and clamp to the max 255
            r = Math.min(255, Math.round(r * brightnessFactor));
            g = Math.min(255, Math.round(g * brightnessFactor));
            b = Math.min(255, Math.round(b * brightnessFactor));
            // Set a higher alpha for more "pop"
            const newAlpha = 0x88;
            return (newAlpha << 24) | (r << 16) | (g << 8) | b;
        }
        return undefined;
    }
}

/**
 * DataLabelProvider for the {@link TreemapRenderableSeries} to manage the labels of rectangles
 * in the treemap - the bigger the rectangle, the more information is shown
 */
class TreemapDataLabelProvider extends RectangleSeriesDataLabelProvider {
    constructor(options?: IRectangleSeriesDataLabelProviderOptions) {
        super(options);
    }

    // Override "getText" method to provide dynamic text based on rectangle size
    getText(state: any): string {
        const metadata = state.getMetaData() as TTreemapDataItem;
        const colWidth = state.columnWidth; // width updates with scroll

        // No label for items without value
        if (metadata.value === null || metadata.value === undefined) {
            return null;
        }

        // Different text formats based on available space
        if (metadata.value * colWidth > 30000) {
            return `${metadata.name}` + `\n${formatNumber(metadata.progress, ENumericFormat.Decimal, this.precision)}%`;
        }
        if (metadata.value * colWidth > 15000) {
            return (
                `${metadata.shortName || metadata.name}` +
                `\n${formatNumber(metadata.progress, ENumericFormat.Decimal, this.precision)}%`
            );
        }
        if (metadata.value * colWidth > 1500) {
            return `${(metadata.shortName || metadata.name).slice(0, 1)}`;
        }
        return null; // No label for small rectangles
    }
}

const WIDTH = 15;
const HEIGHT = 10;
const RAW_DATA: TTreemapDataItem[] = [
    { name: "Technology", parent: "", value: null },

    { name: "Apple", parent: "Technology", value: 4000, progress: 16.2, shortName: "AAPL" },
    { name: "Microsoft", parent: "Technology", value: 3000, progress: 3.2, shortName: "MSFT" },
    { name: "NVIDIA", parent: "Technology", value: 4000, progress: 10.5, shortName: "NVDA" },
    { name: "Alphabet (Google)", parent: "Technology", value: 2185, progress: 0.8, shortName: "GOOG" },
    { name: "Amazon (AWS)", parent: "Technology", value: 1800, progress: 9.5, shortName: "AMZN" },
    { name: "Meta (Facebook)", parent: "Technology", value: 1569, progress: 13.7, shortName: "META" },
    { name: "TSMC", parent: "Technology", value: 600, progress: 17.9, shortName: "TSM" },
    { name: "Broadcom", parent: "Technology", value: 974, progress: -9.5, shortName: "AVGO" },
    { name: "Samsung", parent: "Technology", value: 500, progress: -3.1, shortName: "SSNLF" },
    { name: "Intel", parent: "Technology", value: 200, progress: -18.5, shortName: "INTC" },
    { name: "AMD", parent: "Technology", value: 180, progress: 7.8, shortName: "AMD" },
    { name: "Salesforce", parent: "Technology", value: 295, progress: 9.2, shortName: "CRM" },
    { name: "Adobe", parent: "Technology", value: 193, progress: 12.7, shortName: "ADBE" },
    { name: "Qualcomm", parent: "Technology", value: 160, progress: -1.9, shortName: "QCO" },
    { name: "IBM", parent: "Technology", value: 140, progress: -0.5, shortName: "IBM" },
    { name: "Oracle", parent: "Technology", value: 475, progress: 2.4, shortName: "ORCL" },
    { name: "Sony", parent: "Technology", value: 120, progress: -18.5, shortName: "SONY" },
    { name: "Cisco", parent: "Technology", value: 110, progress: 17.2, shortName: "CSC" },
    { name: "Uber", parent: "Technology", value: 90, progress: 15.0, shortName: "UBR" },
    { name: "Spotify", parent: "Technology", value: 80, progress: -5.6, shortName: "SPOT" },
    { name: "Zoom", parent: "Technology", value: 70, progress: -8.0, shortName: "ZM" },
    { name: "Dropbox", parent: "Technology", value: 60, progress: 1.0, shortName: "DBX" },
    { name: "Snap", parent: "Technology", value: 50, progress: -1.8, shortName: "SNAP" },
    { name: "Pinterest", parent: "Technology", value: 45, progress: -15.3, shortName: "PINS" },
    { name: "Palantir", parent: "Technology", value: 40, progress: 2.9, shortName: "PLTR" },
    { name: "ASML", parent: "Technology", value: 30, progress: 3.5, shortName: "ASML" },
    { name: "ARM", parent: "Technology", value: 25, progress: 5.2, shortName: "ARM" },
    { name: "ServiceNow", parent: "Technology", value: 20, progress: 11.8, shortName: "NOW" },
    { name: "Atlassian", parent: "Technology", value: 18, progress: 7.9, shortName: "TEAM" },
    { name: "Twilio", parent: "Technology", value: 16, progress: -17.2, shortName: "TWLO" },
    { name: "Cloudflare", parent: "Technology", value: 14, progress: 8.5, shortName: "NET" },
    { name: "Snowflake", parent: "Technology", value: 12, progress: 2.7, shortName: "SNO" },
    { name: "Okta", parent: "Technology", value: 10, progress: 11.4, shortName: "OKT" },
    { name: "Shopify", parent: "Technology", value: 9, progress: 10.8, shortName: "SHO" },
    { name: "Datadog", parent: "Technology", value: 8, progress: -12.1, shortName: "DDO" },
    { name: "GitLab", parent: "Technology", value: 7, progress: -5.6, shortName: "GTLB" },
    { name: "ZoomInfo", parent: "Technology", value: 6, progress: -0.8, shortName: "ZI" },
    { name: "Elastic", parent: "Technology", value: 5, progress: 4.2, shortName: "EST" },
    { name: "Wix", parent: "Technology", value: 4, progress: 0.9, shortName: "WIX" },
    { name: "Fiverr", parent: "Technology", value: 3, progress: -2.5, shortName: "FVR" },
];

// This shows you how to use one of D3's broad layout strategies with the Performance of SciChart
// using a local file as "d3-hierarchy.js" from this folder (no need to install from npm another dependency)
// function prepareDataUsingD3Local(data: TTreemapDataItem[]): RectangluarNode[] {
//     const root = d3.stratify()
//         .id((d: TTreemapDataItem) => d.name)
//         .parentId((d: TTreemapDataItem) => d.parent)(data);

//     root.sum((d: TTreemapDataItem) => + d.value);

//     d3.treemap()
//         .size([WIDTH, HEIGHT])
//         .padding(0.1)
//         (root); // create the treemap layout

//     return root.leaves() as RectangluarNode[];
// }

// uses NPM's "d3-hierarchy" package - recommended if you don't mind an extra 5kb dependency
function prepareDataUsingD3External(data: TTreemapDataItem[]): RectangluarNode[] {
    const root = stratify()
        .id((d) => (d as TTreemapDataItem).name)
        .parentId((d) => (d as TTreemapDataItem).parent)(data);

    root.sum((d) => +(d as TTreemapDataItem).value);

    treemap().size([WIDTH, HEIGHT]).padding(0.1)(root); // create the treemap layout

    return root.leaves() as unknown as RectangluarNode[];
}

export async function drawExample(rootElement: string | HTMLDivElement) {
    // Initialize SciChartSurface. Don't forget to await!
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create XAxis / YAxis
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: "X Axis",
        isVisible: false,
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Y Axis",
        isVisible: false,
        flippedCoordinates: true,
    });
    sciChartSurface.yAxes.add(yAxis);

    const treemapData = prepareDataUsingD3External(RAW_DATA);
    // const treemapData = prepareDataUsingD3External(RAW_DATA); // use this if you don't mind a 5kb dependency -> ("d3-hierarchy")

    // Draw the Rectangle Series
    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: treemapData.map((d) => d.x0),
            yValues: treemapData.map((d) => d.y0),
            x1Values: treemapData.map((d) => d.x1),
            y1Values: treemapData.map((d) => d.y1),
            metadata: treemapData.map((d) => d.data) as any[],
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        strokeThickness: 2,
        resamplingMode: EResamplingMode.None,
        dataLabelProvider: new TreemapDataLabelProvider({
            skipMode: EDataLabelSkipMode.ShowAll,
            color: "white",
            style: {
                fontSize: 13,
                multiLineAlignment: EMultiLineAlignment.Center,
                lineSpacing: 5,
            },
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Center,
            metaDataSelector: (md: unknown) => {
                return (md as TTreemapDataItem).name;
            },
        }),
        // send min and max value percentages to the palette provider as 2 params
        paletteProvider: new StockTreemapPaletteProvider({
            minValue: Math.min(...treemapData.map((d) => (d.data as TTreemapDataItem).progress)),
            maxValue: Math.max(...treemapData.map((d) => (d.data as TTreemapDataItem).progress)),
        }),
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier(), new ZoomPanModifier());

    return { sciChartSurface, wasmContext };
}
