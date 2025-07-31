import {
    NumberRange,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    PolarPanModifier,
    PolarZoomExtentsModifier,
    PolarMouseWheelZoomModifier,
    PolarTriangleRenderableSeries,
    PolarNumericAxis,
    EPolarAxisMode,
    EAxisAlignment,
    SciChartPolarSurface,
} from "scichart";

import constrainedDelaunayTriangulation from "./constrainedDelaunayTriangulation";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartPolarSurface.create(rootElement);

    sciChartSurface.debugRendering = false;

    let showFromSouthPole = false;

    const setView = (positionFromSPole: boolean) => {
        showFromSouthPole = positionFromSPole;

        sciChartSurface.xAxes.clear();
        sciChartSurface.yAxes.clear();
        sciChartSurface.renderableSeries.clear(true);

        const xAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Angular,
            visibleRange: new NumberRange(-180, 180), // longitude
            flippedCoordinates: showFromSouthPole ? true : false,
            axisAlignment: EAxisAlignment.Bottom,
            useNativeText: true,
            drawMajorBands: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorGridLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new PolarNumericAxis(wasmContext, {
            polarAxisMode: EPolarAxisMode.Radial,
            visibleRange: new NumberRange(-90, 90), // latitude
            axisAlignment: EAxisAlignment.Left,
            flippedCoordinates: showFromSouthPole ? false : true,
            useNativeText: true,
            drawMajorBands: false,
            drawMajorGridLines: false,
            drawMajorTickLines: false,
            drawMinorGridLines: false,
            drawMinorTickLines: false,
        });
        sciChartSurface.yAxes.add(yAxis);
    };

    setView(true);

    const [min, max] = [140, 1379302771]; // population min max

    function interpolateColor(min: number, max: number, value: number) {
        // Clamp value between min and max
        value = Math.max(min, Math.min(max, value));
        // Normalize to [0,1]
        let t = (value - min) / (max - min);

        // Parse hex colors to RGB
        function hexToRgb(hex: string) {
            hex = hex.replace(/^#/, "");
            if (hex.length === 3)
                hex = hex
                    .split("")
                    .map((x) => x + x)
                    .join("");
            const num = parseInt(hex, 16);
            return [num >> 16, (num >> 8) & 255, num & 255];
        }

        // Interpolate between two RGB colors
        function lerp(a: number, b: number, t: number) {
            return Math.round(a + (b - a) * t);
        }

        const colorA = hexToRgb("#ffffff");
        const colorB = hexToRgb("#1e3489");
        const r = lerp(colorA[0], colorB[0], t);
        const g = lerp(colorA[1], colorB[1], t);
        const b = lerp(colorA[2], colorB[2], t);

        // Convert back to hex
        return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
    }

    let dataArray: { name: string; gdp: number; population: number; areaData: number[][] }[] = [];

    const setMapJson = (mapData: { features: any[] }) => {
        dataArray = [];

        mapData?.features.forEach((state, i) => {
            if (state.geometry.type === "Polygon") {
                let area = state.geometry.coordinates[0];
                area.pop();
                let areaData = [].concat(...constrainedDelaunayTriangulation(area));

                dataArray.push({
                    name: state.properties.NAME,
                    gdp: +state.properties.GDP_MD_EST,
                    population: +state.properties.POP_EST,
                    areaData,
                });
            } else {
                let polyArea = state.geometry.coordinates;

                if (state.properties.SOVEREIGNT === "Antarctica" && showFromSouthPole === false) {
                    return;
                }

                polyArea.forEach((a: any[]) => {
                    let area = a[0];

                    area.pop();
                    let areaData = [].concat(...constrainedDelaunayTriangulation(area));

                    dataArray.push({
                        name: state.properties.NAME,
                        gdp: +state.properties.GDP_MD_EST,
                        population: +state.properties.POP_EST,
                        areaData,
                    });
                });
            }
        });
    };

    const setMap = () => {
        sciChartSurface.renderableSeries.clear(true);

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            const triangleSeries = new PolarTriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: interpolateColor(min, max, d.population),
                opacity: 0.9,
            });

            return triangleSeries;
        });

        sciChartSurface.renderableSeries.add(...series);
    };

    sciChartSurface.chartModifiers.add(new PolarPanModifier());
    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());
    return { sciChartSurface, wasmContext, setMapJson, setMap, setView };
};
