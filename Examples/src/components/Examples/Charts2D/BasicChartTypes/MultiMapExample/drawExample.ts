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


let dataArray: { name: string; areaData: number[][] }[] = [];

function setMapJson(mapJson: { features: any[]; }) {

    dataArray = []

    mapJson?.features.forEach((state, i) => {


        if (state.geometry.type === "Polygon") {


            let area = state.geometry.coordinates[0];
            area.pop();
            let areaData = constrainedDelaunayTriangulation(area).flat();

            dataArray.push({ name: state.properties.STATE_NAME, areaData });
        } else {
            let polyArea = state.geometry.coordinates;

            polyArea.forEach((a: any[]) => {


                let area = a[0];

                area.pop();
                let areaData = constrainedDelaunayTriangulation(area).flat();
                dataArray.push({ name: state.properties.STATE_NAME, areaData });
            });
        }
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



    const clearMap = () => {
        sciChartSurface.renderableSeries.clear(true);
    }


    const setMap = () => {
        sciChartSurface.renderableSeries.clear(true);

        const series = dataArray.map((d, i) => {
            const dataSeries = new XyDataSeries(wasmContext, {
                xValues: d.areaData.map((p) => p[0]),
                yValues: d.areaData.map((p) => p[1]),
            });

            const triangleSeries = new TriangleRenderableSeries(wasmContext, {
                dataSeries: dataSeries,
                drawMode: ETriangleSeriesDrawMode.List,
                fill: "cornflowerblue", 
                opacity: 0.9,
            });

            return triangleSeries;
        });

        sciChartSurface.renderableSeries.add(...series);
        sciChartSurface.zoomExtents();
    };

    // Add zoom/pan controls
    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new ZoomPanModifier({ enableZoom: true }),
        new MouseWheelZoomModifier()
    );

    return { wasmContext, sciChartSurface, setMap, setMapJson, clearMap };
};
