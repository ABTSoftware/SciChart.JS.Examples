import {
    ZoomExtentsModifier,
    ZoomPanModifier,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    XyDataSeries,
    MouseWheelZoomModifier,
    FastLineRenderableSeries,
    ETriangleSeriesDrawMode,
    FastTriangleRenderableSeries,
    SeriesSelectionModifier,
    ESeriesType,
} from "scichart";

import { appTheme } from "../../../theme";

const colors = [
    "#543005",
    "#8c510a",
    "#bf812d",
    "#dfc27d",
    "#f6e8c3",
    "#f5f5f5",
    "#c7eae5",
    "#80cdc1",
    "#35978f",
    "#01665e",
    "#003c30",
];

function preserveAspectRatio(
    width: number,
    height: number,
    minVisibleX: number,
    maxVisibleX: number,
    minVisibleY: number,
    maxVisibleY: number
) {
    // Calculate current visible dimensions
    const visibleWidth = maxVisibleX - minVisibleX;
    const visibleHeight = maxVisibleY - minVisibleY;

    // Calculate aspect ratios
    const containerAspectRatio = width / height;
    const visibleAspectRatio = visibleWidth / visibleHeight;

    // Calculate center points for maintaining position
    const centerX = (minVisibleX + maxVisibleX) / 2;
    const centerY = (minVisibleY + maxVisibleY) / 2;

    let newMinX, newMaxX, newMinY, newMaxY;

    if (containerAspectRatio > visibleAspectRatio) {
        // Container is wider - expand visible X range
        const newVisibleWidth = visibleHeight * containerAspectRatio;
        const widthDiff = newVisibleWidth - visibleWidth;

        newMinX = minVisibleX - widthDiff / 2;
        newMaxX = maxVisibleX + widthDiff / 2;
        newMinY = minVisibleY;
        newMaxY = maxVisibleY;
    } else {
        // Container is taller - expand visible Y range
        const newVisibleHeight = visibleWidth / containerAspectRatio;
        const heightDiff = newVisibleHeight - visibleHeight;

        newMinX = minVisibleX;
        newMaxX = maxVisibleX;
        newMinY = minVisibleY - heightDiff / 2;
        newMaxY = maxVisibleY + heightDiff / 2;
    }

    return {
        minVisibleX: newMinX,
        maxVisibleX: newMaxX,
        minVisibleY: newMinY,
        maxVisibleY: newMaxY,
    };
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy, isInnerAxis: true }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy, isInnerAxis: true }));

    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
        // new SeriesSelectionModifier({
        //     enableHover: true,
        //     onHoverChanged: (args) => {
        //         console.log("onHoverChanged");
        //         args.allSeries
        //             .filter((series) => series.type === ESeriesType.TriangleSeries)
        //             .forEach((series, index) => {
        //                 // outlines[index].strokeThickness = series.isHovered ? 15 : 1
        //             });
        //     },
        // })
    );

    sciChartSurface.genericAnimationsRun.subscribe(() => {
        const result = preserveAspectRatio(
            sciChartSurface.viewRect.width,
            sciChartSurface.viewRect.height,
            xAxis.visibleRange.min,
            xAxis.visibleRange.max,
            yAxis.visibleRange.min,
            yAxis.visibleRange.max
        );

        xAxis.visibleRange = new NumberRange(result.minVisibleX, result.maxVisibleX);
        yAxis.visibleRange = new NumberRange(result.minVisibleY, result.maxVisibleY);
    });

    let dataArray: any[] = [];
    let outlines: number[][][] = [];

    function setConvertedData(convertedData: any[]) {
        outlines = [];
        dataArray = convertedData;
        convertedData.forEach((d) => {
            outlines.push(d.outline);
        });
    }

    const setMap = () => {
        // outline

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p: any[]) => p[0]),
                yValues: d.areaData.map((p: any[]) => p[1]),
            });

            const triangleSeries = new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: colors[(i % colors.length) + 1],
                opacity: 0.5,
            });

            return triangleSeries;
        });

        sciChartSurface.renderableSeries.add(...series);

        // outline
        const outlinesSC = outlines.map((outline) => {
            const xVals = outline.map((d) => d[0]);
            const yVals = outline.map((d) => d[1]);

            //FastMountainRenderableSeries
            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: xVals,
                    yValues: yVals,
                }),
                stroke: "black", //appTheme.VividSkyBlue,
                strokeThickness: 2,
                opacity: 1,
                // fill: "rgba(100, 149, 237, 1)",
                // zeroLineY: calculatePolygonCenter(outline)[1],
            });

            return lineSeries;
        });

        sciChartSurface.renderableSeries.add(...outlinesSC);

        sciChartSurface.zoomExtents();
    };

    const clearMap = () => {
        sciChartSurface.renderableSeries.clear(true);
    };

    return { wasmContext, sciChartSurface, controls: { setMap, clearMap, setConvertedData } };
};
