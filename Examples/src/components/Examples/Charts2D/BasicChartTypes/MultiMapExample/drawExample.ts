import {
    ZoomExtentsModifier,
    ZoomPanModifier,
    NumericAxis,
    SciChartSurface,
    NumberRange,
    XyDataSeries,
    MouseWheelZoomModifier,
    FastLineRenderableSeries,
} from "scichart";

import { appTheme } from "../../../theme";

let dataArray: { name: string; areaData: number[][] }[] = [];
let outlines: number[][][] = [];

function setMapJson(mapJson: { features: any[] }) {
    dataArray = [];
    outlines = [];

    mapJson?.features.forEach((state, i) => {
        if (state.geometry.type === "Polygon") {
            let area = state.geometry.coordinates[0];

            outlines.push(area);
        } else {
            let polyArea = state.geometry.coordinates;

            polyArea.forEach((a: any[]) => {
                let area = a[0];

                outlines.push(area);
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
    };

    const setMap = () => {
        // outline

        const outlinesSC = outlines.map((outline) => {
            const xVals = outline.map((d) => d[0]);
            const yVals = outline.map((d) => d[1]);

            const lineSeries = new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, {
                    xValues: xVals,
                    yValues: yVals,
                }),
                stroke: appTheme.VividSkyBlue,
                strokeThickness: 2,
                opacity: 0.6,
            });

            return lineSeries;
        });

        sciChartSurface.renderableSeries.add(...outlinesSC);

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
