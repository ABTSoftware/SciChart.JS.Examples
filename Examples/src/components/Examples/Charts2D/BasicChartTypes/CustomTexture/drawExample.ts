import {
    NumberRange,
    SciChartSurface,
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    FastTriangleRenderableSeries,
    ETriangleSeriesDrawMode,
    XyxyDataSeries,
    ICustomTextureOptions,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    createImageAsync,
    FastBandRenderableSeries,
    XyyDataSeries,
    ELineDrawMode,
    SplineMountainRenderableSeries,
    XyDataSeries,
} from "scichart";

import { appTheme } from "../../../theme";

import scichartImg from "./scichart.jpg";
import mountain from "./mountain.jpg";
import cloud from "./cloud.jpg";
import buildings from "./buildings.jpg";
import moon from "./moon.jpg";

let textureRepeat = false;

export class ImageTextureOptions implements ICustomTextureOptions {
    isPerPrimitive?: boolean = false;
    options: { image: HTMLImageElement; textureWidth?: number; textureHeight?: number; repeat?: boolean };
    textureHeight: number = 800;
    textureWidth: number = 600;
    repeat = false;

    public constructor(options: {
        image: HTMLImageElement;
        textureWidth?: number;
        textureHeight?: number;
        repeat?: boolean;
    }) {
        this.options = options;
        this.textureHeight = options.textureHeight;
        this.textureWidth = options.textureWidth;
        this.repeat = options.repeat;
    }

    public createTexture(
        context: CanvasRenderingContext2D
    ) {
        context.drawImage(this.options.image, 0, 0);
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.01, 0.01);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const scichartBitmap = await createImageAsync(scichartImg);
    const mountainBitmap = await createImageAsync(mountain);
    const cloudBitmap = await createImageAsync(cloud);
    const buildingsBitmap = await createImageAsync(buildings);
    const moonBitmap = await createImageAsync(moon);

    // triangles
    const polygonSeries = new FastTriangleRenderableSeries(wasmContext, {
        isDigitalLine: false,
        fill: "cornflowerblue",
        drawMode: ETriangleSeriesDrawMode.Strip,
        polygonVertices: 6, // Sets the number of vertices per polygon. Applies only for drawMode ETriangleSeriesDrawMode.Polygon
        customTextureOptions: new ImageTextureOptions({
            image: scichartBitmap,
            textureWidth: 600,
            textureHeight: 324,
            repeat: textureRepeat,
        }),
        opacity: 0.5,
    });

    const dataSeries = new XyxyDataSeries(wasmContext);

    let myData: number[][] = [];

    function generateRectangle(minX: number, maxX: number, minY: number, maxY: number) {
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        [
            [midX, midY, 0.5, 0.5], // Center point
            [minX, minY, 0, 1], // Bottom-left
            [maxX, minY, 1, 1], // Bottom-right
            [maxX, maxY, 1, 0], // Top-right
            [minX, maxY, 0, 0], // Top-left
            [minX, minY, 0, 1], // Bottom-left (duplicate)
        ].forEach((d) => {
            myData.push([d[0], d[1], d[2], d[3]]);
            dataSeries.append(d[0], d[1], d[2], d[3]);
        });
    }

    console.log(myData);

    generateRectangle(500, 950, 150, 400);

    polygonSeries.dataSeries = dataSeries;

    // rectangless

    const xValues = [0, 110, 220, 330];
    const yValues = [20, 0, 20, 0];
    const x1Values = [100, 210, 320, 430];
    const y1Values = [320, 300, 320, 300];

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues,
            yValues,
            x1Values,
            y1Values,
        }),
        columnXMode: EColumnMode.StartEnd, // x, x1
        columnYMode: EColumnYMode.TopBottom, // y, y1
        stroke: "black",
        strokeThickness: 2,
        customTextureOptions: new ImageTextureOptions({
            image: buildingsBitmap,
            textureWidth: 640,
            textureHeight: 480,
            repeat: textureRepeat,
        }),
        opacity: 1,
    });

    // band
    const dataSeriesB = new XyyDataSeries(wasmContext);
    const POINTSB = 1000;
    const STEPB = (3 * Math.PI) / POINTSB;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        let y = Math.sin(i * STEPB) * k * 0.7;
        const y1 = Math.cos(i * STEPB) * k;
        if (i >= 200 && i <= 300) {
            y = NaN;
        }
        dataSeriesB.append(i, y * 100 + 500, y1 * 100 + 500);
    }
    const bandSeries = new FastBandRenderableSeries(wasmContext, {
        dataSeries: dataSeriesB,
        strokeThickness: 2,
        drawNaNAs: ELineDrawMode.PolyLine,
        customTextureOptions: new ImageTextureOptions({
            image: cloudBitmap,
            textureWidth: 640,
            textureHeight: 480,
            repeat: textureRepeat,
        }),
    });

    // mountain

    const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
        stroke: "black",
        strokeThickness: 2,
        zeroLineY: 0.0,
        fill: "rgba(176, 196, 222, 0.7)",
        interpolationPoints: 5,
        customTextureOptions: new ImageTextureOptions({
            image: mountainBitmap,
            textureWidth: 400,
            textureHeight: 300,
            repeat: textureRepeat,
        }),
        // pointMarker: new EllipsePointMarker(wasmContext),
    });

    const dataSeriesM = new XyDataSeries(wasmContext);
    const POINTS = 10;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
        const y = Math.abs(Math.sin(i * STEP)) * 100;
        dataSeriesM.append(i * 100, y);
    }
    mountainSeries.dataSeries = dataSeriesM;

    // triangle

    const sXValues = [100, 100, 300, 300, 300, 100];
    const sYValues = [500, 350, 350, 370, 520, 520];

    const triangkeSeries = new FastTriangleRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: sXValues,
            yValues: sYValues,
        }),
        drawMode: ETriangleSeriesDrawMode.List,
        customTextureOptions: new ImageTextureOptions({
            image: moonBitmap,
            textureWidth: 800,
            textureHeight: 600,
            repeat: textureRepeat,
        }),
    });

    sciChartSurface.renderableSeries.add(polygonSeries, triangkeSeries, rectangleSeries, bandSeries, mountainSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};
