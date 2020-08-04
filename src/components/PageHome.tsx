import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { MouseWheelZoomModifier } from "../../../src/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "../../../src/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "../../../src/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "../../../src/Charting/Model/XyDataSeries";
import { NumericAxis } from "../../../src/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "../../../src/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "../../../src/Charting/Visuals/SciChartSurface";
import { NumberRange } from "../../../src/Core/NumberRange";

const divElementId = "chart";
export const HOME_PAGE_TITLE = "Homepage super-duper"

export default function PageHome() {
    React.useEffect(() => {
        // drawExample();
    }, []);

    return (
        <div>
            <div style={{ maxWidth: 800, marginBottom: 20 }}>
                <Typography variant="body1" style={{ color: "blue" }}>
                    Homepage bla-bla-bla
                </Typography>
            </div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <br />
            <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                <Button>Button</Button>
            </ButtonGroup>
        </div>
    );
}

// export const drawExample = async () => {
//     const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
//     const xAxis = new NumericAxis(wasmContext);
//     sciChartSurface.xAxes.add(xAxis);
//
//     const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
//     sciChartSurface.yAxes.add(yAxis);
//
//     const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#fff", strokeThickness: 5 });
//     sciChartSurface.renderableSeries.add(lineSeries);
//
//     const dataSeries = new XyDataSeries(wasmContext);
//     for (let i = 0; i < 100; i++) {
//         dataSeries.append(i, Math.sin(i * 0.1));
//     }
//     lineSeries.dataSeries = dataSeries;
//
//     sciChartSurface.chartModifiers.add(new ZoomPanModifier());
//     sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
//     sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
//
//     sciChartSurface.zoomExtents();
//     return { sciChartSurface, wasmContext };
// };
