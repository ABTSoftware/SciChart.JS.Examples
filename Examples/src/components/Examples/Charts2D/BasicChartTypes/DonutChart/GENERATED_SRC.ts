export const code = `import * as React from "react";
import { EPieType, SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import classes from "../../../../Examples/Examples.module.scss";

export const divElementId = "chart";

export const drawExample = async () => {
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId);
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
    const [placementValue, setPlacementValue] = React.useState<ELegendPlacement>(ELegendPlacement.TopLeft);
    const [orientationValue, setOrientationValue] = React.useState<ELegendOrientation>(ELegendOrientation.Vertical);

    React.useEffect(() => {
        drawExample().then(scps => {
            setSciChartPieSurface(scps);
            setShowControls(true);
        });
    }, []);

    const handleChangePlacement = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = +event.target.value as ELegendPlacement;
        setPlacementValue(newValue);
        sciChartPieSurface.legend.placement = newValue;
    };

    const handleChangeOrientation = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = +event.target.value as ELegendOrientation;
        setOrientationValue(newValue);
        sciChartPieSurface.legend.orientation = newValue;
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.SelectWrapper}>
                <div className={classes.InputSelectWrapper}>
                    <label id="sciChartPlacement-label">
                        Legend Placement
                        <select
                            id="sciChartPlacement"
                            value={placementValue}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                e.preventDefault();
                                if (showControls) handleChangePlacement(e);
                            }}
                        >
                            {placementSelect.map(el => (
                                <option key={el.value} value={el.value}>
                                    {el.text}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>{" "}
                <div className={classes.InputSelectWrapper}>
                    <label id="sciChartOrientation-label">
                        Legend Orientation
                        <select
                            id="sciChartOrientation"
                            value={orientationValue}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                e.preventDefault();
                                if (showControls) handleChangeOrientation(e);
                            }}
                        >
                            {orientationSelect.map(el => (
                                <option key={el.value} value={el.value}>
                                    {el.text}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
`;