import { appTheme } from "scichart-example-dependencies";
import {
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EStrokePaletteMode,
    LineSeriesDataLabelProvider,
    NumericAxis,
    NumberRange,
    parseColorToUIntArgb,
    SciChartSurface,
    SplineLineRenderableSeries,
    TextAnnotation,
    Thickness,
    XyDataSeries,
    EllipsePointMarker,
    RolloverModifier,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create a chart with X, Y axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.2, 0.2) }));
    // Given a dataset with X, Y but also additional values in the form of an object of any kind
    const dataValues = [
        { x: 0, y: 50, anObject: { label: "", pointColor: "#F48420", isSelected: false } },
        { x: 1, y: 35, anObject: { label: "Orange Point", pointColor: "#F48420", isSelected: false } },
        { x: 2, y: 68, anObject: { label: "Highest Point", pointColor: "#7BCAAB", isSelected: false } },
        { x: 3, y: 58, anObject: { label: "Selected Point", pointColor: "#F48420", isSelected: true } },
        { x: 4, y: 50, anObject: { label: "Orange Point", pointColor: "#F48420", isSelected: false } },
        { x: 5, y: 50, anObject: { label: "", pointColor: "#F48420", isSelected: false } },
        { x: 6, y: 40, anObject: { label: "Blue Point", pointColor: "#50C7E0", isSelected: false } },
        { x: 7, y: 53, anObject: { label: "Selected Point", pointColor: "#F48420", isSelected: true } },
        { x: 8, y: 55, anObject: { label: "", pointColor: "#F48420", isSelected: false } },
        { x: 9, y: 23, anObject: { label: "Blue Point", pointColor: "#50C7E0", isSelected: false } },
        { x: 10, y: 45, anObject: { label: "Selected Point", pointColor: "#F48420", isSelected: true } },
        { x: 11, y: 12, anObject: { label: "Lowest Point", pointColor: "#EC0F6C", isSelected: false } },
        { x: 12, y: 59, anObject: { label: "", pointColor: "#F48420", isSelected: false } },
        { x: 13, y: 60, anObject: { label: "", pointColor: "#F48420", isSelected: false } },
    ];
    // You can create a dataseries with these object values as metadata
    const xyDataSeriesWithMetadata = new XyDataSeries(wasmContext, {
        xValues: dataValues.map((row) => row.x),
        yValues: dataValues.map((row) => row.y),
        metadata: dataValues.map((row) => row.anObject), // put any javascript object here
    });
    // You can assign this dataseries to a RenderableSeries in SciChart
    const lineSeries = new SplineLineRenderableSeries(wasmContext, {
        dataSeries: xyDataSeriesWithMetadata,
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 15,
            height: 15,
            strokeThickness: 0,
        }),
    });
    // Now you can consume metadata in the following ways
    // - Colouring points
    // - Labelling points
    // - Custom data for tooltips
    // - Tagging datapoints with the objects for later use
    //
    // 1. via paletteprovider (colour points or segments based on metadata values)
    // @ts-ignore
    const getColorFromMetadata = (metadata) => {
        // @ts-ignore
        const pointColorArgb = parseColorToUIntArgb(metadata.pointColor);
        const selectedColorArgb = 0xffffffff;
        const fill = metadata.isSelected ? selectedColorArgb : pointColorArgb;
        return fill;
    };
    const pointPaletteProvider = {
        strokePaletteMode: EStrokePaletteMode.SOLID,
        onAttached(parentSeries) {},
        onDetached() {},
        overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
            // Metadata values can be used in paletteprovider overrides
            if (metadata) {
                const fill = getColorFromMetadata(metadata);
                return { stroke: fill, fill };
            }
            return undefined; // means use default colour
        },
    };
    lineSeries.paletteProvider = pointPaletteProvider;
    // 2. Via DataLabel provider
    const dataLabelProvider = new LineSeriesDataLabelProvider({
        // @ts-ignore
        metaDataSelector: (metadata) => metadata.label,
        style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(5, 5, 5, 5) },
        color: appTheme.ForegroundColor,
    });
    lineSeries.dataLabelProvider = dataLabelProvider;
    // This is how you override colors of labels on a per-label basis, which can also come from metadata
    dataLabelProvider.getColor = (state, label) => {
        const metadata = state.getMetaData();
        return getColorFromMetadata(metadata);
    };
    // 3. Via cursors and tooltips
    lineSeries.rolloverModifierProps.markerColor = appTheme.DarkIndigo;
    lineSeries.rolloverModifierProps.tooltipColor = appTheme.Indigo;
    lineSeries.rolloverModifierProps.tooltipDataTemplate = (seriesInfo) => {
        const valuesWithLabels = [];
        // Line Series
        const xySeriesInfo = seriesInfo;
        valuesWithLabels.push("X Value: " + xySeriesInfo.formattedXValue);
        valuesWithLabels.push("Y Value: " + xySeriesInfo.formattedYValue);
        valuesWithLabels.push(" ");
        if (seriesInfo.pointMetadata) {
            // @ts-ignore
            let label = seriesInfo.pointMetadata.label;
            label = label === "" ? "..." : label;
            valuesWithLabels.push(`Metadata Label: "${label}"`);
            // @ts-ignore
            valuesWithLabels.push("Metadata Selected: " + seriesInfo.pointMetadata.isSelected);
        }
        return valuesWithLabels;
    };
    sciChartSurface.renderableSeries.add(lineSeries);
    // Add a RolloverModifier for tooltips
    sciChartSurface.chartModifiers.add(
        new RolloverModifier({
            showRolloverLine: false,
            showTooltip: true,
        })
    );
    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Line Chart with Metadata (Objects per data-point)",
            fontSize: 18,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
