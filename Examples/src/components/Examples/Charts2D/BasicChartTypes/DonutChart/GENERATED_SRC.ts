export const code = `import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { EPieType, SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";

export const divElementId = "chart";

export const drawExample = async () => {
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId);
    sciChartPieSurface.applyTheme(new SciChartJSLightTheme());
    sciChartPieSurface.pieType = EPieType.Donut;
    sciChartPieSurface.holeRadius = 0.6;
    sciChartPieSurface.animate = true;
    sciChartPieSurface.legend.showLegend = true;
    sciChartPieSurface.legend.showCheckboxes = true;
    sciChartPieSurface.legend.animate = true;
    const pieSegment1 = new PieSegment({
        color: "#228B22",
        value: 40,
        text: "Green",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#1D976C", offset: 0 },
            { color: "#93F9B9", offset: 1 }
        ])
    });
    const pieSegment2 = new PieSegment({
        value: 10,
        text: "Red",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#DD5E89", offset: 0 },
            { color: "#F7BB97", offset: 1 }
        ])
    });
    const pieSegment3 = new PieSegment({
        value: 20,
        text: "Blue",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#1FA2FF", offset: 0 },
            { color: "#12D8FA", offset: 0.5 },
            { color: "#A6FFCB", offset: 1 }
        ])
    });
    const pieSegment4 = new PieSegment({
        value: 15,
        text: "Yellow",
        colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "#F09819", offset: 0 },
            { color: "#EDDE5D", offset: 1 }
        ])
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    return sciChartPieSurface;
};

const placementSelect = [
    { value: ELegendPlacement.TopLeft, text: "Top-Left" },
    { value: ELegendPlacement.TopRight, text: "Top-Right" },
    { value: ELegendPlacement.BottomLeft, text: "Bottom-Left" },
    { value: ELegendPlacement.BottomRight, text: "Bottom-Right" }
];

const orientationSelect = [
    { value: ELegendOrientation.Vertical, text: "Vertical" },
    { value: ELegendOrientation.Horizontal, text: "Horizontal" }
];

export default function DonutChart() {
    const [showControls, setShowControls] = React.useState(false);
    const [sciChartPieSurface, setSciChartPieSurface] = React.useState<SciChartPieSurface>();
    const [placementValue, setPlacementValue] = React.useState<ELegendPlacement>(ELegendPlacement.TopRight);
    const [orientationValue, setOrientationValue] = React.useState<ELegendOrientation>(ELegendOrientation.Vertical);

    React.useEffect(() => {
        drawExample().then(scps => {
            setSciChartPieSurface(scps);
            scps.legend.placement = placementValue;
            setShowControls(true);
        });
    }, []);

    const handleChangePlacement = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as ELegendPlacement;
        setPlacementValue(newValue);
        sciChartPieSurface.legend.placement = newValue;
    };

    const handleChangeOrientation = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as ELegendOrientation;
        setOrientationValue(newValue);
        sciChartPieSurface.legend.orientation = newValue;
    };

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20, display: showControls ? "flex" : "none" }}>
                <FormControl variant="filled" style={{ width: 200 }}>
                    <InputLabel id="sciChartPlacement-label">Legend Placement</InputLabel>
                    <Select
                        labelId="sciChartPlacement-label"
                        id="sciChartPlacement"
                        value={placementValue}
                        onChange={handleChangePlacement}
                    >
                        {placementSelect.map(el => (
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
                        {orientationSelect.map(el => (
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