
import { EPieType, SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { EColor } from "scichart/types/Color";

export async function updatePieChart(divElementId: string) {
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId);

    const theme = { ...new SciChartJSLightTheme() };
    theme.sciChartBackground = "Transparent";
    sciChartPieSurface.applyTheme(theme);
    sciChartPieSurface.pieType = EPieType.Pie;
    sciChartPieSurface.legend.showLegend = false;
    sciChartPieSurface.animate = true;
    sciChartPieSurface.animationFrames = 30;

    const pieSegment1 = new PieSegment({
        color: EColor.Green,
        value: 5,
        text: "Green",
    });
    const pieSegment2 = new PieSegment({
        color: EColor.Red,
        value: 10,
        text: "Red",
    });
    const pieSegment3 = new PieSegment({
        color: EColor.Blue,
        value: 15,
        text: "Blue",
    });
    const pieSegment4 = new PieSegment({
        color: EColor.Yellow,
        value: 20,
        text: "Yellow",
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

    let updateCount = 0;
    const updateFunc = () => {
        if (updateCount < 10) {
            pieSegment1.value = Math.random() * 20 + 10;
            pieSegment2.value = Math.random() * 20 + 10;
            pieSegment3.value = Math.random() * 20 + 10;
            pieSegment4.value = Math.random() * 20 + 10;
        }
        updateCount++;
        setTimeout(() => updateFunc(), 2000);
    };

    setTimeout(updateFunc, 1000);
}
