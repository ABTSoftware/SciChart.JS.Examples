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
    PolarNumericAxis,
    EPolarAxisMode,
    EAxisAlignment,
    EPolarLabelMode,
} from "scichart";

// import mapJson from "./australian-states.json";

// import mapJson from "./world.json";

// import mapJson from "./us-states.json";

// import mapJson from "./africa.json";

import { appTheme } from "../../../theme";

import constrainedDelaunayTriangulation from "./constrainedDelaunayTriangulation";


let dataArray: { name: string; areaData: number[][] }[] = [];

function setMapJson(mapJson: { features: any[]; }) {

    dataArray = []

    mapJson?.features.forEach((state, i) => {
        // console.log(state.properties.STATE_NAME);

        if (state.geometry.type === "Polygon") {
            // console.log("Polygon");

            let area = state.geometry.coordinates[0];
            area.pop();
            let areaData = constrainedDelaunayTriangulation(area).flat();

            dataArray.push({ name: state.properties.STATE_NAME, areaData });
        } else {
            let polyArea = state.geometry.coordinates;

            polyArea.forEach((a: any[]) => {
                // console.log("MultiPolygon");
                // console.log(a);

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


    // (Polar)TriangleRenderableSeries ?


    // const radialYAxis = new PolarNumericAxis(wasmContext, {
    //     polarAxisMode: EPolarAxisMode.Radial,
    //     axisAlignment: EAxisAlignment.Right,
    //     // visibleRange: new NumberRange(0, 6),
    //     zoomExtentsToInitialRange: true,
        
    //     drawMinorTickLines: false,
    //     drawMajorTickLines: false,
    //     drawMinorGridLines: false,
    //     // majorGridLineStyle: {
    //     //     color: appTheme.DarkIndigo,
    //     //     strokeThickness: 1,
    //     // },
    //     startAngle: 0,
    //     drawLabels: false, // no radial labels

    //     // innerRadius: 0.1, // donut hole
    // });
    // sciChartSurface.yAxes.add(radialYAxis);

    // const polarXAxis = new PolarNumericAxis(wasmContext, {
    //     polarAxisMode: EPolarAxisMode.Angular,
    //     axisAlignment: EAxisAlignment.Top,
    //     polarLabelMode: EPolarLabelMode.Parallel,
    //     // visibleRange: new NumberRange(0, 9),
    //     startAngle: Math.PI / 2, // start at 12 o'clock
    //     flippedCoordinates: true, // go clockwise
    //     zoomExtentsToInitialRange: true,

    //     drawMinorTickLines: false,
    //     drawMajorTickLines: false,
    //     drawMinorGridLines: false,

    //     useNativeText: true,
    //     // labelPrecision: 0,
    //     // labelStyle: {
    //     //     color: "white",
    //     // },
    //     // majorGridLineStyle: {
    //     //     color: appTheme.DarkIndigo,
    //     //     strokeThickness: 1,
    //     // },
    // });
    // sciChartSurface.xAxes.add(polarXAxis);




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
                fill: "cornflowerblue", // interpolateColor(min, max, keyData[d.name][key]),
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
