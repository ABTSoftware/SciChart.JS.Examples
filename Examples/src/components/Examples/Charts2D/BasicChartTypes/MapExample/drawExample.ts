import {
    ZoomExtentsModifier,
    ZoomPanModifier,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    XyDataSeries,
    ETriangleSeriesDrawMode,
    TriangleRenderableSeries,
    MouseWheelZoomModifier,
} from "scichart";

import mapJson from "./australian-states.json";

// import mapJson from "./world.json";

// import mapJson from "./us-states.json";

// import mapJson from "./africa.json";

import { appTheme } from "../../../theme";

import constrainedDelaunayTriangulation from "./constrainedDelaunayTriangulation";

import { getMinMax, interpolateColor, keyData, australiaData } from "./helpers";

type Keytype = "population" | "population_density" | "area_km2";

const dataArray: { name: string; areaData: number[][] }[] = [];

mapJson.features.forEach((state, i) => {
    // console.log(state.properties.STATE_NAME);

    if (state.geometry.type === "Polygon") {
        // console.log("Polygon");

        let area = state.geometry.coordinates[0];
        area.pop();
        let areaData = constrainedDelaunayTriangulation(area).flat();

        dataArray.push({ name: state.properties.STATE_NAME, areaData });
    } else {
        let polyArea = state.geometry.coordinates;

        polyArea.forEach((a) => {
            // console.log("MultiPolygon");
            // console.log(a);

            let area = a[0];

            area.pop();
            let areaData = constrainedDelaunayTriangulation(area).flat();
            dataArray.push({ name: state.properties.STATE_NAME, areaData });
        });
    }
});

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy }));

    const setMap = (key: Keytype) => {

        sciChartSurface.renderableSeries.clear(true);

        const [min, max] = getMinMax(key, australiaData);

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            const triangleSeries = new TriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: interpolateColor(min, max, keyData[d.name][key]),
                opacity: 0.9,
            });

            return triangleSeries;
        });

        sciChartSurface.renderableSeries.add(...series);
    };

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface, setMap };
};
