import {
    ZoomExtentsModifier,
    ZoomPanModifier,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    FastTriangleRenderableSeries,
    MouseWheelZoomModifier,
    FastBubbleRenderableSeries,
    EllipsePointMarker,
    XyzDataSeries,
    IPointMetadata,
    EHorizontalTextPosition,
    Thickness,
    EVerticalTextPosition,
    FastLineRenderableSeries,
} from "scichart";

import { appTheme } from "../../../theme";

import { getMinMax, interpolateColor, keyData, australiaData, preserveAspectRatio } from "./helpers";

import { australianCities } from "./australiaData";

type Keytype = "population" | "population_density" | "area_km2";

const dataArray: { name: string; areaData: number[][] }[] = [];
const outlines: number[][][] = [];

function setMapJson(mapJson: any) {
    mapJson.forEach((d: any) => {
        outlines.push(d.outline);
        dataArray.push({ name: d.name, areaData: d.areaData });
    });
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: true }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: true }));

    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    let firsStime = true;

    const setMap = (key: Keytype) => {
        sciChartSurface.renderableSeries.clear(true);

        const [min, max] = getMinMax(key, australiaData);

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            const triangleSeries = new FastTriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: interpolateColor(min, max, keyData[d.name][key]),
                opacity: 0.9,
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
                stroke: appTheme.DarkIndigo,
                strokeThickness: 2,
                opacity: 1,
            });

            return lineSeries;
        });

        sciChartSurface.renderableSeries.add(...outlinesSC);

        // cities
        const cLongitude = australianCities.map((d) => d.longitude);
        const clatitude = australianCities.map((d) => d.latitude);
        const cSize = australianCities.map((d) => 5);
        const cMetadata = australianCities.map((d) => d) as unknown as IPointMetadata[];

        const citiesSeries = new FastBubbleRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 64,
                height: 64,
                fill: appTheme.ForegroundColor,
                strokeThickness: 0,
            }),
            dataSeries: new XyzDataSeries(wasmContext, {
                xValues: cLongitude,
                yValues: clatitude,
                zValues: cSize,
                metadata: cMetadata,
            }),
            dataLabels: {
                verticalTextPosition: EVerticalTextPosition.Above,
                horizontalTextPosition: EHorizontalTextPosition.Right,
                style: {
                    fontFamily: "Arial",
                    fontSize: 14,
                    padding: new Thickness(0, 0, 3, 3),
                },
                color: "#EEE",
                metaDataSelector: (md) => {
                    const metadata = md as unknown as { name: string };
                    return metadata.name.toString();
                },
            },
        });
        sciChartSurface.renderableSeries.add(citiesSeries);

        if (firsStime) {
            sciChartSurface.zoomExtents();
            firsStime = false;
        }

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

    return { wasmContext, sciChartSurface, setMap, setMapJson };
};
