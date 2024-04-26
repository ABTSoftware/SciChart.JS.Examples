import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import {
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ELineDrawMode,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    PinchZoomModifier,
    SciChartSurface,
    TextAnnotation,
    XyDataSeries,
    ZoomPanModifier,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        title: "SciChartSurface with Series Drawn Behind Axis",
        titleStyle: {
            fontSize: 20,
            fontWeight: "Bold",
            placeWithinChart: true,
            padding: Thickness.fromString("14 2 10 0"),
            color: appTheme.ForegroundColor + "C4",
        },
    });

    // When true, Series are drawn behind axis (Axis inside chart)
    sciChartSurface.drawSeriesBehindAxis = true;

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            visibleRange: new NumberRange(28.0, 42.6),
            axisTitle: "X Axis",
            labelStyle: {
                fontSize: 20,
            },
            axisBorder: {
                borderTop: 0,
                color: appTheme.PaleSkyBlue + "33",
            },
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            visibleRange: new NumberRange(-40.0, 140.0),
            axisTitle: "Y Axis",
            labelStyle: {
                fontSize: 20,
            },
            axisBorder: {
                borderLeft: 0,
                color: appTheme.PaleSkyBlue + "33",
            },
        })
    );

    const xValues = [];
    const yValues = [];
    const y1Values = [];

    for (let i = 0; i < 100; i += 0.1) {
        xValues.push(i);
        yValues.push(Math.tan(i));
        y1Values.push(Math.cos(i * 100) * 5);
    }

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            drawNaNAs: ELineDrawMode.PolyLine,
            strokeThickness: 5,
            stroke: "rgba(255, 134, 72, .47)",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            drawNaNAs: ELineDrawMode.PolyLine,
            strokeThickness: 3,
            stroke: "rgba(50, 134, 72, .47)",
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values }),
        })
    );

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier()
    );

    return { sciChartSurface, wasmContext };
};

export default function DrawBehindAxes() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    const [preset, setPreset] = React.useState<number>(0);

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    const handleToggleButtonChanged = (event: any, value: number) => {
        setPreset(value);
        sciChartSurfaceRef.current.drawSeriesBehindAxis = value === 0;
        sciChartSurfaceRef.current.title =
            value === 0
                ? "SciChartSurface with Series Drawn Behind Axis"
                : "SciChartSurface with Series clipped to Viewport";
        sciChartSurfaceRef.current.yAxes.get(0).axisBorder.borderLeft = value;
        sciChartSurfaceRef.current.xAxes.get(0).axisBorder.borderTop = value;
    };

    return (
        <div className={classes.ChartWrapper} style={{ background: appTheme.DarkIndigo }}>
            <div id={divElementId} style={{ height: "calc(100% - 100px)", width: "100%" }} />
            <ToggleButtonGroup
                style={{ height: "100px", padding: "10" }}
                exclusive
                value={preset}
                onChange={handleToggleButtonChanged}
                size="medium"
                color="primary"
                aria-label="small outlined button group"
            >
                <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>
                    Draw Series behind Axis
                </ToggleButton>
                <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>
                    Clip series at Viewport Edge
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
