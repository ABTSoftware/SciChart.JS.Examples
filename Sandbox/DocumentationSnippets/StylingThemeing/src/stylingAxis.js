import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";

export async function stylingAxisInCode(divId) {

    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId );


    // Create and style xAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            drawMajorBands: true,
            axisBandsFill: "#FF665555",
            axisTitleStyle: {
                fontSize: 16,
                fontFamily: "Arial",
                color: "#4682b4",
                fontWeight: "bold",
                fontStyle: "italic"
            },
            majorGridLineStyle: {
                strokeThickness: 1,
                color: "#ADFF2F",
                strokeDasharray: [10, 5]
            },
            minorGridLineStyle: {
                strokeThickness: 1,
                color: "#EE82EE",
                strokeDasharray: [2, 2]
            },
            majorTickLineStyle: {
                strokeThickness: 1,
                color: "Blue",
                tickSize: 8
            },
            minorTickLineStyle: {
                strokeThickness: 1,
                color: "Red",
                tickSize: 4
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "Italic",
                color: "#4682b4",
                fontFamily: "Arial"
            }
        })
    );

    // Create and style left YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisBandsFill: "#FF665555",
            axisTitle: "Left Y Axis",
            axisTitleStyle: {
                fontSize: 25,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                color: "#DC143C"
            },
            majorGridLineStyle: {
                strokeThickness: 1,
                color: "#ADFF2F",
                strokeDasharray: [10, 5]
            },
            minorGridLineStyle: {
                strokeThickness: 1,
                color: "#EE82EE",
                strokeDasharray: [2, 2]
            },
            majorTickLineStyle: {
                strokeThickness: 1,
                color: "#ADFF2F",
                tickSize: 8
            },
            minorTickLineStyle: {
                strokeThickness: 1,
                color: "#EE82EE",
                tickSize: 4
            },
            labelStyle: {
                fontSize: 15,
                color: "#DC143C",
                fontFamily: "Arial"
            }
        })
    );
}

export class stylingAxis {
}
