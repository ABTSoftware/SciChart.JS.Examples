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
    type IPointMetadata,
    EHorizontalTextPosition,
    Thickness,
    EVerticalTextPosition,
    FastLineRenderableSeries,
    SciChartJsNavyTheme,
} from "scichart";

import { getMinMax, interpolateColor, keyData, australiaData, preserveAspectRatio } from "./helpers";
import { australianCities } from "./australiaData";

const FOREGROUND_COLOR = "#F5F5F5";
const TEXT_COLOR = "#F5F5F5";

const dataArray: { name: string; areaData: number[][] }[] = [];
const outlines: number[][][] = [];

function setMapJson(mapJson: unknown[]) {
    dataArray.length = 0;
    outlines.length = 0;
    (mapJson as { name: string; outline: number[][]; areaData: number[][] }[]).forEach((d) => {
        outlines.push(d.outline);
        dataArray.push({ name: d.name, areaData: d.areaData });
    });
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: new SciChartJsNavyTheme(),
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: false }));

    const xAxis = sciChartSurface.xAxes.get(0);
    const yAxis = sciChartSurface.yAxes.get(0);

    let firstTime = true;

    const setMap = () => {
        sciChartSurface.renderableSeries.clear(true);

        const [min, max] = getMinMax("population", australiaData);

        const series = dataArray.map((d) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            return new FastTriangleRenderableSeries(wasmContext, {
                dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: interpolateColor(min, max, keyData[d.name]["population"]),
                opacity: 0.9,
            });
        });

        sciChartSurface.renderableSeries.add(...series);

        const outlinesSC = outlines.map((outline) => {
            return new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: outline.map((d) => d[0]),
                    yValues: outline.map((d) => d[1]),
                }),
                stroke: "#FFFFFF",
                strokeThickness: 1,
                opacity: 1,
            });
        });

        sciChartSurface.renderableSeries.add(...outlinesSC);

        const cLongitude = australianCities.map((d) => d.longitude);
        const cLatitude = australianCities.map((d) => d.latitude);
        const cSize = australianCities.map(() => 5);
        const cMetadata = australianCities.map((d) => d) as unknown as IPointMetadata[];

        const citiesSeries = new FastBubbleRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 64,
                height: 64,
                fill: FOREGROUND_COLOR,
                strokeThickness: 0,
            }),
            dataSeries: new XyzDataSeries(wasmContext, {
                xValues: cLongitude,
                yValues: cLatitude,
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
                color: TEXT_COLOR,
                metaDataSelector: (md) => {
                    const metadata = md as unknown as { name: string };
                    return metadata.name.toString();
                },
            },
        });
        sciChartSurface.renderableSeries.add(citiesSeries);

        if (firstTime) {
            sciChartSurface.zoomExtents();
            firstTime = false;
        }
    };

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

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface, setMap, setMapJson };
};
