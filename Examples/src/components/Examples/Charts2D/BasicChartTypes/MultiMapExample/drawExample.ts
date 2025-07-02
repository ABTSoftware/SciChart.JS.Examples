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
} from "scichart";

import { appTheme } from "../../../theme";

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

let dataArray: any[] = [];
let outlines: number[][][] = [];

// function setMapJson(mapJson: { features: any[] }) {
//     dataArray = [];
//     outlines = [];

//     mapJson?.features.forEach((state, i) => {
//         if (state.geometry.type === "Polygon") {
//             let area = state.geometry.coordinates[0];

//             outlines.push(area);
//         } else {
//             let polyArea = state.geometry.coordinates;

//             polyArea.forEach((a: any[]) => {
//                 let area = a[0];

//                 outlines.push(area);
//             });
//         }
//     });
// }

function setConvertedData(convertedData: any[]) {
    outlines = [];
    dataArray = convertedData;
    convertedData.forEach((d) => {
        outlines.push(d.outline);
    });
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    const clearMap = () => {
        sciChartSurface.renderableSeries.clear(true);
    };

    let triangeCount = 0;

    const setMap = () => {
        // outline

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

        // const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p: any[]) => p[0]),
                yValues: d.areaData.map((p: any[]) => p[1]),
            });

            const triangleSeries = new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                // fill: "steelblue", //interpolateColor(min, max, keyData[d.name][key]),
                fill: colors[(i % colors.length) + 1],
                opacity: 0.5,
            });

            triangeCount += dataSeries.count() / 3;

            return triangleSeries;
        });

        console.log({ triangeCount });
        triangeCount = 0;

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

        // const outlinesSC = outlines.map((outline) => {
        //     const xVals = outline.map((d) => d[0]);
        //     const yVals = outline.map((d) => d[1]);

        //     const lineSeries = new FastLineRenderableSeries(wasmContext, {
        //         dataSeries: new XyDataSeries(wasmContext, {
        //             xValues: xVals,
        //             yValues: yVals,
        //         }),
        //         stroke: appTheme.VividSkyBlue,
        //         strokeThickness: 2,
        //         opacity: 0.6,
        //     });

        //     return lineSeries;
        // });

        // sciChartSurface.renderableSeries.add(...outlinesSC);

        sciChartSurface.zoomExtents();

        sciChartSurface.preRender.subscribe(() => {
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
    };

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface, setMap, clearMap, setConvertedData };
};
