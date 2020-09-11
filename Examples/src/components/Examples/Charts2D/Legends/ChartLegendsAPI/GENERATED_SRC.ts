export const code = `
import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { TSciChart } from "scichart/types/TSciChart";
import { SciChartLegend } from "scichart/Charting/Visuals/Legend/SciChartLegend";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    // sciChartSurface.applyTheme(new SciChartJSDarkTheme());
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;

    const colors = ["#FFFF00", "#228B22", "#ff0000", "#368BC1"];
    colors.forEach((color, index) => {
        const k = colors.length - index - 1;
        const dataSeries = new XyDataSeries(wasmContext);
        if (index === 0) {
            dataSeries.dataSeriesName = "Super-duper series";
        }
        const alfa = 0.3 + k * 0.2;
        for (let i = 10; i <= 100; i++) {
            dataSeries.append(i * 0.1, alfa * i * 500);
        }
        const lineSeries = new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 3 });
        sciChartSurface.renderableSeries.add(lineSeries);
        lineSeries.stroke = color;
    });

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

const placementSelect = [
    { value: ELegendPlacement.TopLeft, text: "Top-Left" },
    { value: ELegendPlacement.TopRight, text: "Top-Right" },
    { value: ELegendPlacement.BottomLeft, text: "Bottom-Left" },
    { value: ELegendPlacement.BottomRight, text: "Bottom-Right" },
];

const orientationSelect = [
    { value: ELegendOrientation.Vertical, text: "Vertical" },
    { value: ELegendOrientation.Horizontal, text: "Horizontal" },
];

export default function ChartLegendsAPI() {
    const [chartReady, setChartReady] = React.useState(false);
    const [wasmContext, setWasmContext] = React.useState<TSciChart>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [sciChartLegend, setSciChartLegend] = React.useState<SciChartLegend>();
    const [placementValue, setPlacementValue] = React.useState<ELegendPlacement>(ELegendPlacement.TopLeft);
    const [orientationValue, setOrientationValue] = React.useState<ELegendOrientation>(ELegendOrientation.Vertical);
    const [showLegendValue, setShowLegendValue] = React.useState(true);
    const [showCheckboxesValue, setShowCheckboxesValue] = React.useState(true);
    const [showSeriesMarkersValue, setShowSeriesMarkersValue] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setWasmContext(res.wasmContext);
            const lm = new LegendModifier({
                placement: placementValue,
                orientation: orientationValue,
                showLegend: showLegendValue,
                showCheckboxes: showCheckboxesValue,
                showSeriesMarkers: showSeriesMarkersValue,
            });
            res.sciChartSurface.chartModifiers.add(lm);
            setSciChartLegend(lm.sciChartLegend);
            setChartReady(true);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleChangePlacement = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as ELegendPlacement;
        setPlacementValue(newValue);
        sciChartLegend.placement = newValue;
    };

    const handleChangeOrientation = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as ELegendOrientation;
        setOrientationValue(newValue);
        sciChartLegend.orientation = newValue;
    };

    const handleChangeShowLegend = (event: React.ChangeEvent<{ checked: boolean }>) => {
        const newValue = event.target.checked;
        setShowLegendValue(newValue);
        sciChartLegend.showLegend = newValue;
    };

    const handleChangeShowCheckboxes = (event: React.ChangeEvent<{ checked: boolean }>) => {
        const newValue = event.target.checked;
        setShowCheckboxesValue(newValue);
        sciChartLegend.showCheckboxes = newValue;
    };

    const handleChangeShowSeriesMarkers = (event: React.ChangeEvent<{ checked: boolean }>) => {
        const newValue = event.target.checked;
        setShowSeriesMarkersValue(newValue);
        sciChartLegend.showSeriesMarkers = newValue;
    };

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20, display: chartReady ? "flex" : "none" }}>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showLegendValue}
                                onChange={handleChangeShowLegend}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Show Legend"
                    />
                </FormControl>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showCheckboxesValue}
                                onChange={handleChangeShowCheckboxes}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Show Checkboxes"
                    />
                </FormControl>
                <FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showSeriesMarkersValue}
                                onChange={handleChangeShowSeriesMarkers}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="Show Series Markers"
                    />
                </FormControl>
            </div>
            <div style={{ marginTop: 20, display: chartReady ? "flex" : "none" }}>
                <FormControl variant="filled" style={{ width: 200 }}>
                    <InputLabel id="sciChartPlacement-label">Legend Placement</InputLabel>
                    <Select
                        labelId="sciChartPlacement-label"
                        id="sciChartPlacement"
                        value={placementValue}
                        onChange={handleChangePlacement}
                    >
                        {placementSelect.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.text}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" style={{ width: 200, marginLeft: 10 }}>
                    <InputLabel id="sciChartOrientation-label">Legend Orientation</InputLabel>
                    <Select
                        labelId="sciChartOrientation-label"
                        id="sciChartOrientation"
                        value={orientationValue}
                        onChange={handleChangeOrientation}
                    >
                        {orientationSelect.map((el) => (
                            <MenuItem key={el.value} value={el.value}>
                                {el.text}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

`;
