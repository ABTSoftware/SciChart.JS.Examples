export const code = `import * as React from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { TSciChart } from "scichart/types/TSciChart";
import { IXyDataSeriesOptions, XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const divElementId = "chart";

const drawExample = async (): Promise<TWebAssemblyChart> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    sciChartSurface.yAxes.add(yAxis);

    const firstSeriesData = createDataSeries(wasmContext, 0, { dataSeriesName: "Sinewave A" });
    const secondSeriesData = createDataSeries(wasmContext, 1);

    // Series 1
    const renderableSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: colorsArr[0],
        strokeThickness: 3,
        dataSeries: firstSeriesData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: "white",
            stroke: colorsArr[0],
        }),
    });
    sciChartSurface.renderableSeries.add(renderableSeries1);

    // Series 2
    const renderableSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: colorsArr[1],
        strokeThickness: 3,
        dataSeries: secondSeriesData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: "white",
            stroke: colorsArr[1],
        }),
    });
    renderableSeries2.rolloverModifierProps.tooltipTextColor = "black";
    renderableSeries2.rolloverModifierProps.showRollover = true;
    sciChartSurface.renderableSeries.add(renderableSeries2);

    sciChartSurface.chartModifiers.add(new RolloverModifier());
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

const createDataSeries = (wasmContext: TSciChart, index: number, options?: IXyDataSeriesOptions) => {
    const sigma = Math.pow(0.6, index);
    const dataSeries = new XyDataSeries(wasmContext, options);
    for (let i = 0; i < 100; i++) {
        const grow = 1 + i / 99;
        dataSeries.append(i, Math.sin((Math.PI * i) / 15) * grow * sigma);
    }
    return dataSeries;
};

const colorsArr = ["#368BC1", "#eeeeee", "#228B22", "#be0000", "#ff6600", "#ff0000"];

export default function UsingRolloverModifierTooltips() {
    const [showButtons, setShowButtons] = React.useState(false);
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [lastSeriesTooltipColor, setLastSeriesTooltipColor] = React.useState<string>("");

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setWasmContext(res.wasmContext);
            setShowButtons(true);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleAddSeries = () => {
        const currentLength = sciChartSurface.renderableSeries.size();
        if (currentLength >= colorsArr.length) {
            return;
        }
        const newIndex = currentLength;
        const newDataSeries = createDataSeries(wasmContext, newIndex);
        const color = colorsArr[newIndex];
        const newRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            stroke: color,
            strokeThickness: 3,
            dataSeries: newDataSeries,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 5,
                height: 5,
                strokeThickness: 2,
                fill: "white",
                stroke: color,
            }),
        });
        sciChartSurface.renderableSeries.add(newRenderableSeries);
    };

    const handleRemoveSeries = () => {
        const currentLength = sciChartSurface.renderableSeries.size();
        if (currentLength <= 0) {
            return;
        }
        const index = currentLength - 1;
        sciChartSurface.renderableSeries.removeAt(index);
    };

    const handleChangeTooltipColor = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newColor = event.target.value as string;
        setLastSeriesTooltipColor(newColor);
        const length = sciChartSurface.renderableSeries.size();
        if (length > 0) {
            const lastRenderableSeries = sciChartSurface.renderableSeries.get(length - 1);
            lastRenderableSeries.rolloverModifierProps.tooltipColor = newColor;
        }
    };

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <FormControl variant="filled" style={{ marginTop: 20, display: showButtons ? "flex" : "none", width: 200 }}>
                <InputLabel id="stroke-thickness-label">Tooltip Color</InputLabel>
                <Select
                    labelId="stroke-thickness-label"
                    id="stroke-thickness"
                    value={lastSeriesTooltipColor}
                    onChange={handleChangeTooltipColor}
                >
                    <MenuItem value="#ff0000">Red</MenuItem>
                    <MenuItem value="#228B22">Green</MenuItem>
                    <MenuItem value="#368BC1">Blue</MenuItem>
                </Select>
            </FormControl>
            <FormControl style={{ marginTop: 20, display: showButtons ? "flex" : "none" }}>
                <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                    <Button onClick={handleAddSeries} size="medium" color="primary" variant="outlined">
                        Add Series
                    </Button>
                    <Button onClick={handleRemoveSeries} size="medium" color="primary" variant="outlined">
                        Remove Series
                    </Button>
                </ButtonGroup>
            </FormControl>
        </div>
    );
}
`;