import * as React from "react";
import {EPieType, SciChartPieSurface} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import {PieSegment} from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import classes from "../../../../Examples/Examples.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import {appTheme} from "../../../theme";

export const divElementId1 = "chart1";

export const drawExample = async () => {

    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId1, {
        theme: appTheme.SciChartJsTheme,
        pieType: EPieType.Pie,
        animate: true,
        showLegend: true,
        showLegendCheckBoxes: true
    });

    const pieSegment1 = new PieSegment({
        value: 40,
        text: "Green",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividSkyBlue, offset: 0 },
            { color: appTheme.VividSkyBlue + "77", offset: 1 }
        ]),
        isSelected: true,
    });

    const pieSegment2 = new PieSegment({
        value: 10,
        text: "Red",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividPink, offset: 0 },
            { color: appTheme.VividPink + "77", offset: 1 }
        ])
    });

    const pieSegment3 = new PieSegment({
        value: 20,
        text: "Blue",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividOrange, offset: 0 },
            { color: appTheme.VividOrange + "77", offset: 1 }
        ])
    });

    const pieSegment4 = new PieSegment({
        value: 15,
        text: "Orange",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividGreen, offset: 0 },
            { color: appTheme.VividGreen + "77", offset: 1 }
        ])
    });

    sciChartPieSurface.pieSegments.add(
        pieSegment1, pieSegment2, pieSegment3, pieSegment4
    );

    // const selectSegments = () => {
    //     console.log("Selecting segments state");
    //     setTimeout(() => pieSegment1.isSelected = true, 0);
    //     setTimeout(() => pieSegment2.isSelected = true, 1000);
    //     setTimeout(() => pieSegment3.isSelected = true, 2000);
    //     setTimeout(() => pieSegment4.isSelected = true, 3000);
    //     setTimeout(() => {
    //         pieSegment1.isSelected = false;
    //         pieSegment2.isSelected = false;
    //         pieSegment3.isSelected = false;
    //         pieSegment4.isSelected = false;
    //     }, 4000);
    // };
    //
    // const adjustRadius = () => {
    //     console.log("adjustRadius state");
    // };

    // let currentState = 0;
    // const allStates = [selectSegments, adjustRadius];
    //
    // const updateState = () => {
    //     allStates[currentState++]();
    //     if (currentState >= allStates.length) {
    //         currentState = 0;
    //     }
    //     setTimeout(updateState, 5000);
    // }

    // updateState();

    return sciChartPieSurface;
};

export default function PieChart() {
    const [chart, setChart] = React.useState<SciChartPieSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setChart(res);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => chart?.delete();
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId1} style={{ width: "100%", height: "100%" }}/>
        </div>
    );
}
