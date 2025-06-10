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

import { appTheme } from "../../../theme";

import constrainedDelaunayTriangulation from "./constrainedDelaunayTriangulation";

import { interpolateColor, keyData, australiaData } from "./helpers";

type Keytype = "population" | "population_density" | "area_km2";

const dataArray: { name: string; area: number; areaData: number[][] }[] = [];

function setMapJson(mapJson: { features: any[] }) {

    mapJson?.features.forEach((state, i) => {

        if (state.geometry.type === "Polygon") {
            let area = state.geometry.coordinates[0];
            area.pop();
            let areaData = constrainedDelaunayTriangulation(area).flat();

            dataArray.push({ name: state.properties.NAME, area: state.properties.CENSUSAREA, areaData });
        } else {
            let polyArea = state.geometry.coordinates;

            polyArea.forEach((a: any[]) => {
                let area = a[0];

                area.pop();
                let areaData = constrainedDelaunayTriangulation(area).flat();
                dataArray.push({ name: state.properties.NAME, area: state.properties.CENSUSAREA, areaData });
            });
        }
    });
}

const [min, max] = [1033.814, 570640.95];


export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.1, 0.1);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: false  }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy, isVisible: false  }));

    const setMap = (key: Keytype) => {
        sciChartSurface.renderableSeries.clear(true);

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            const triangleSeries = new TriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: interpolateColor(min, max, d.area),
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

    return { wasmContext, sciChartSurface, setMap, setMapJson };
};
