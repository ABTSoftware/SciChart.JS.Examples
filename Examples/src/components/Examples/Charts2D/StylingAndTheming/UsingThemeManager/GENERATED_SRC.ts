export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import classes from "../../../../Examples/Examples.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import {appTheme} from "../../../theme";
import {Thickness} from "scichart/Core/Thickness";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint} from "scichart/types/AnchorPoint";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {SciChartJSDarkv2Theme} from "scichart/Charting/Themes/SciChartJSDarkv2Theme";
import {IThemeProvider, ThemeProvider} from "scichart/Charting/Themes/IThemeProvider";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {EAnimationType} from "scichart/types/AnimationType";
import {SciChartJsNavyTheme} from "scichart/Charting/Themes/SciChartJsNavyTheme";

const divElementId1 = "chart1";
const divElementId2 = "chart2";
const divElementId3 = "chart3";
const divElementId4 = "chart4";

const drawExample = async () => {

    const createLineData = (whichSeries: number) => {
        const data = ExampleDataProvider.getFourierSeriesZoomed(1.0, 0.1, 5.0, 5.15);

        return {
            xValues: data.xValues,
            yValues: data.yValues.map(y => (whichSeries === 0 ? y : whichSeries === 1 ? y * 1.1 : y * 1.5))
        };
    };

    const createThemedChart = async (divId: string, title: string, theme: IThemeProvider) => {

        // Create a SciChartSurface passing theme into constructor options
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
            theme,
        });

        // Create the X,Y Axis
        sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
            labelPrecision: 2,
            maxAutoTicks: 8
        }));
        sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
            labelPrecision: 2,
            maxAutoTicks: 8,
            growBy: new NumberRange(0.05, 0.2) })
        );

        // Add title annotation
        sciChartSurface.annotations.add(
            new TextAnnotation({
                text: title,
                fontSize: 16,
                textColor: theme.tickTextBrush,
                x1: 0.5,
                y1: 0,
                opacity: 0.77,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative
            })
        );

        let data = createLineData(2);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        data = createLineData(1);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        data = createLineData(0);

        // Create and add a line series to the chart
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: new XyDataSeries(wasmContext, { xValues: data.xValues, yValues: data.yValues }),
                stroke: "auto",
                strokeThickness: 3,
                animation: {
                    type: EAnimationType.Sweep,
                    options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 }
                }
            })
        );

        return sciChartSurface;
    };

    const charts = await Promise.all([
        createThemedChart(divElementId1, "Navy Theme", new SciChartJsNavyTheme()),
        createThemedChart(divElementId2, "Light Theme", new SciChartJSLightTheme()),
        createThemedChart(divElementId3, "Dark Theme", new SciChartJSDarkv2Theme()),
        createThemedChart(divElementId4, "Custom Theme", customTheme),
    ]);

    return { charts };
};

// Create a custom theme based on light theme + some modifications
const customTheme: IThemeProvider = {
    ... new SciChartJSLightTheme(),
    axisBandsFill: "#83D2F511",
    axisBorder: "#1F3D68",
    gridBackgroundBrush: "white",
    gridBorderBrush: "white",
    loadingAnimationForeground: "#6495ED77",
    loadingAnimationBackground: "#E4F5FC",
    majorGridLineBrush: "#264B9322",
    minorGridLineBrush: "#264B9306",
    sciChartBackground: "#E4F5FC",
    tickTextBrush: "#1F3D68",
    axisTitleColor: "#1F3D68",
    // auto / default colour palette for lines and fills
    strokePalette: [ "#264B93", "#A16DAE", "#C52E60" ],
    fillPalette: [ "#264B9333", "#A16DAE33", "#C52E6033" ],
};

// Styles for the 2x2 grid
const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: appTheme.Background
    },
    flexContainerRow: {
        display: "flex",
        flex: "auto",
        flexBasis: "50%",
        justifyContent: "space-between",
        alignContent: "stretch",
        margin: 10,
        width: "calc(100% - 10px)"
    },
    item: {
        flex: "auto",
        height: "100%",
        marginRight: 10,
    }
}));

export default function UsingThemeManager() {
    const [charts, setCharts] = React.useState<SciChartSurface[]>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setCharts(res.charts);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => charts?.forEach(sciChartSurface => sciChartSurface?.delete());
    }, []);

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId1} className={localClasses.item} />
                    <div id={divElementId2} className={localClasses.item} />
                </div>
                <div className={localClasses.flexContainerRow}>
                    <div id={divElementId3} className={localClasses.item} />
                    <div id={divElementId4} className={localClasses.item} />
                </div>
            </div>
        </div>
    );
}
`;