import {
    SciChartSurface,
    NumericAxis,
    FastBandRenderableSeries,
    FastRectangleRenderableSeries,
    XyyDataSeries,
    XyxyDataSeries,
    EColumnMode,
    EColumnYMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EAutoRange,
    Thickness,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    EFillPaletteMode,
    EStrokePaletteMode,
    IPointMetadata,
    parseColorToUIntArgb,
    EDataLabelSkipMode,
    RectangleSeriesDataLabelProvider,
    IRectangleSeriesDataLabelProviderOptions,
} from "scichart";
import { appTheme } from "../../../theme";
import { sankey, SankeyNode, SankeyLink } from "d3-sankey";

// Define types for our Sankey data
interface SankeyNodeData {
    name: string;
    category: string;
}

interface SankeyLinkData {
    value: number;
}

type MySankeyNode = SankeyNode<SankeyNodeData, SankeyLinkData>;
type MySankeyLink = SankeyLink<SankeyNodeData, SankeyLinkData>;

// Metadata type for nodes
interface NodeMetadata extends IPointMetadata {
    name: string;
    value: number;
    category: string;
    color: string;
    isSelected: boolean;
}

// Sample data for energy flow Sankey diagram
const SANKEY_DATA = {
    nodes: [
        { name: "Coal", category: "source" },
        { name: "Natural Gas", category: "source" },
        { name: "Nuclear", category: "source" },
        { name: "Renewables", category: "source" },
        { name: "Electricity", category: "conversion" },
        { name: "Heat", category: "conversion" },
        { name: "Residential", category: "consumption" },
        { name: "Commercial", category: "consumption" },
        { name: "Industrial", category: "consumption" },
        { name: "Transportation", category: "consumption" },
    ],
    links: [
        { source: 0, target: 4, value: 25 }, // Coal -> Electricity
        { source: 0, target: 5, value: 10 }, // Coal -> Heat
        { source: 1, target: 4, value: 35 }, // Natural Gas -> Electricity
        { source: 1, target: 5, value: 20 }, // Natural Gas -> Heat
        { source: 2, target: 4, value: 20 }, // Nuclear -> Electricity
        { source: 3, target: 4, value: 15 }, // Renewables -> Electricity
        { source: 4, target: 6, value: 30 }, // Electricity -> Residential
        { source: 4, target: 7, value: 25 }, // Electricity -> Commercial
        { source: 4, target: 8, value: 35 }, // Electricity -> Industrial
        { source: 4, target: 9, value: 5 },  // Electricity -> Transportation
        { source: 5, target: 6, value: 15 }, // Heat -> Residential
        { source: 5, target: 8, value: 15 }, // Heat -> Industrial
    ],
};

// Color palette for different categories
const CATEGORY_COLORS: Record<string, string> = {
    source: appTheme.VividBlue,
    conversion: appTheme.VividOrange,
    consumption: appTheme.VividTeal,
};

// Link colors based on source node
const LINK_COLORS = [
    appTheme.MutedBlue,    // Coal
    appTheme.MutedOrange,  // Natural Gas
    appTheme.MutedPurple,  // Nuclear
    appTheme.MutedTeal,    // Renewables
    appTheme.MutedPink,    // Electricity
    appTheme.MutedRed,     // Heat
];

/**
 * Interpolates a cubic bezier curve for smooth Sankey links
 */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const oneMinusT = 1 - t;
    return (
        oneMinusT * oneMinusT * oneMinusT * p0 +
        3 * oneMinusT * oneMinusT * t * p1 +
        3 * oneMinusT * t * t * p2 +
        t * t * t * p3
    );
}

/**
 * Creates band series data for a Sankey link with smooth bezier curves
 */
function createLinkBandData(link: MySankeyLink, chartHeight: number) {
    const xValues: number[] = [];
    const yValues: number[] = [];
    const y1Values: number[] = [];

    const sourceNode = link.source as MySankeyNode;
    const targetNode = link.target as MySankeyNode;

    // Get link coordinates (d3-sankey provides y0, y1 for source and target)
    const x0 = sourceNode.x1!;
    const x1 = targetNode.x0!;
    const sourceY0 = link.y0!;
    const targetY0 = link.y1!;
    const linkWidth = link.width!;

    // Sample points along the bezier curve
    const numPoints = 30;
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;

        // X follows a simple linear interpolation
        const x = x0 + t * (x1 - x0);

        // Y follows a bezier curve for smooth flow
        const yCenter = cubicBezier(t, sourceY0, sourceY0, targetY0, targetY0);

        // Flip Y coordinates for SciChart (Y increases upward)
        const flippedYCenter = chartHeight - yCenter;

        xValues.push(x);
        yValues.push(flippedYCenter + linkWidth / 2);
        y1Values.push(flippedYCenter - linkWidth / 2);
    }

    return { xValues, yValues, y1Values };
}

/**
 * PaletteProvider for the Sankey nodes to manage colors based on category
 */
class SankeyNodePaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;

    public onAttached(): void {}
    public onDetached(): void {}

    public overrideFillArgb(
        _xValue: number,
        _yValue: number,
        _index: number,
        _opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const nodeMetadata = metadata as unknown as NodeMetadata;
        if (nodeMetadata?.color) {
            return parseColorToUIntArgb(nodeMetadata.color + 85);
        }
        return undefined;
    }

    public overrideStrokeArgb(
        _xValue: number,
        _yValue: number,
        _index: number,
        _opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const nodeMetadata = metadata as unknown as NodeMetadata;
        if (nodeMetadata?.color) {
            // Lighter stroke color
            return parseColorToUIntArgb(appTheme.ForegroundColor);
        }
        return undefined;
    }
}

/**
 * DataLabelProvider for Sankey nodes
 */
class SankeyDataLabelProvider extends RectangleSeriesDataLabelProvider {
    constructor(options?: IRectangleSeriesDataLabelProviderOptions) {
        super(options);
    }

    getText(state: { getMetaData: () => unknown }): string | null {
        const metadata = state.getMetaData() as NodeMetadata;
        if (metadata?.name) {
            return metadata.name;
        }
        return null;
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Define chart dimensions for d3-sankey layout
    const chartWidth = 800;
    const chartHeight = 500;

    // Configure d3-sankey layout generator
    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
        .nodeWidth(20)
        .nodePadding(15)
        .extent([
            [50, 50],
            [chartWidth - 50, chartHeight - 50],
        ])
        .nodeAlign((node: MySankeyNode) => {
            // Align nodes by category
            const category = node.category;
            if (category === "source") return 0;
            if (category === "conversion") return 1;
            return 2;
        });

    // Generate Sankey layout
    const sankeyData = sankeyGenerator({
        nodes: SANKEY_DATA.nodes.map((d) => ({ ...d })),
        links: SANKEY_DATA.links.map((d) => ({ ...d })),
    });

    const { nodes, links } = sankeyData;

    // Configure axes to match the Sankey layout dimensions
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, chartWidth),
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawLabels: false,
        autoRange: EAutoRange.Never,
    });

    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, chartHeight),
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawLabels: false,
        autoRange: EAutoRange.Never,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Render links using FastBandRenderableSeries
    links.forEach((link: MySankeyLink, index: number) => {
        const { xValues, yValues, y1Values } = createLinkBandData(link, chartHeight);

        // Get color based on source node
        const sourceIndex = typeof link.source === "number" ? link.source : (link.source as MySankeyNode).index!;
        const linkColor = LINK_COLORS[sourceIndex % LINK_COLORS.length];

        const linkSeries = new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues,
                y1Values,
                dataSeriesName: `Link ${index}`,
            }),
            fill: linkColor + "88",
            fillY1: linkColor + "88",
            stroke: linkColor,
            strokeY1: linkColor,
            strokeThickness: 1,
            opacity: 0.7,
        });

        sciChartSurface.renderableSeries.add(linkSeries);
    });

    // Render nodes using FastRectangleRenderableSeries
    const nodeXValues: number[] = [];
    const nodeYValues: number[] = [];
    const nodeX1Values: number[] = [];
    const nodeY1Values: number[] = [];
    const nodeMetadata: NodeMetadata[] = [];

    nodes.forEach((node: MySankeyNode) => {
        nodeXValues.push(node.x0!);
        // Flip Y coordinates for SciChart
        nodeYValues.push(chartHeight - node.y1!);
        nodeX1Values.push(node.x1!);
        nodeY1Values.push(chartHeight - node.y0!);

        const totalValue = node.value || 0;
        const color = CATEGORY_COLORS[node.category] || appTheme.VividBlue;
        nodeMetadata.push({
            name: node.name,
            value: totalValue,
            category: node.category,
            color: color,
            isSelected: false,
        });
    });

    const nodeSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: nodeXValues,
            yValues: nodeYValues,
            x1Values: nodeX1Values,
            y1Values: nodeY1Values,
            dataSeriesName: "Sankey Nodes",
            metadata: nodeMetadata as unknown as IPointMetadata[],
        }),
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.TopBottom,
        stroke: appTheme.ForegroundColor,
        strokeThickness: 1,
        fill: appTheme.VividBlue,
        paletteProvider: new SankeyNodePaletteProvider(),
        dataLabelProvider: new SankeyDataLabelProvider({
            skipMode: EDataLabelSkipMode.ShowAll,
            color: appTheme.ForegroundColor,
            style: {
                fontSize: 11,
            },
            horizontalTextPosition: EHorizontalTextPosition.Right,
            verticalTextPosition: EVerticalTextPosition.Center,
        }),
    });

    sciChartSurface.renderableSeries.add(nodeSeries);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    // Set padding to show labels
    sciChartSurface.padding = new Thickness(10, 80, 10, 10);

    return {
        sciChartSurface,
        wasmContext,
    };
};
