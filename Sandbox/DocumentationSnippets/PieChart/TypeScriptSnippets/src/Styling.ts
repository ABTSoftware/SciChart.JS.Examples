import { PieLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/PieLabelProvider";
import { IPieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/IPieSegment";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { SciChartPieSurface, EPieType } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { Point } from "scichart/Core/Point";
import { EColor } from "scichart/types/Color";

export async function pieChartLabelFormat(divElementId: string) {
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId);
    // Set this to adjust the radial position of the labels
    // When positioning outside the pie, you may want to make further fine adjustments to label positions using the labelOffset as shown below
    sciChartPieSurface.labelRadiusAdjustment = 1.7;

    // set default label style
    sciChartPieSurface.labelStyle = { fontSize: 14, color: EColor.White };

    // labelProvider on the surface will be used if an override is not set on a segment
    sciChartPieSurface.labelProvider.getSegmentText = (segment: IPieSegment, total) =>
        `<span>${segment.text}<span><br/><span>${segment.value.toFixed(0)} (${((100 * segment.value) / total).toFixed(
            1
        )}%)</span>`;

    const pieSegment1 = new PieSegment({
        color: "#f8f682",
        value: 40,
        text: "Bananas",
        labelOffset: new Point(10, 0),
        // labelStyles can be overridden per segment.  
        // These will be merged onto the surface style so the resulting style here is fontSize: 14, color: "#f8f682"
        labelStyle: { color: "#f8f682" }
    });

    const pieSegment2 = new PieSegment({
        color: "#00a1ff",
        value: 10,
        text: "Apples",
        labelOffset: new Point(0, -20)
    });
    // If you set a property on the segment labelProvider, it will override the one on the surface
    pieSegment2.labelProvider.getSegmentText = (segment: IPieSegment, total) => "Some Apples";

    // You can also pass labelProvider options in on the constructor.
    const pieSegment3 = new PieSegment({
        color: "#f0b44c",
        value: 20,
        text: "Oranges",
        labelProvider: new PieLabelProvider({ labelPrefix: "Oranges: "}),
        labelOffset: new Point(-25, 0),
        labelStyle: { color: "#f0b44c" }
    });

    const pieSegment4 = new PieSegment({
        color: "#72f884",
        value: 15,
        text: "Grapes"
    });
    // Overriding a property on the segment labelProvider implicitly creates a new default PieLabelProvider that overries the one set on the surface
    pieSegment4.labelProvider.formatLabel = (dataValue: number) => dataValue.toFixed(2) + "%";

    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    return sciChartPieSurface;
}

