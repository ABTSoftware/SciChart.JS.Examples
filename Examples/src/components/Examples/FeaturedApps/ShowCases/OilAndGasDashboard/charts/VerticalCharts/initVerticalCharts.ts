import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import { drawDensityChart } from "./DensityChart";
import { drawPoreSpaceChart } from "./PoreSpaceChart";
import { drawResistivityChart } from "./ResistivityChart";
import { drawShaleChart } from "./ShaleChart";
import { drawSonicChart } from "./SonicChart";
import { drawTextureChart } from "./TextureChart";
import { appTheme } from "./../../theme";

const surfaceGroup = new SciChartVerticalGroup();

export const initVerticalCharts = () => Promise.all([
    drawShaleChart(),
    drawDensityChart(),
    drawResistivityChart(),
    drawPoreSpaceChart(),
    drawSonicChart(),
    drawTextureChart(),
]).then((surfaces) => {
    surfaces.forEach((surface) => {
        surfaceGroup.addSurfaceToGroup(surface);
        surface.chartModifiers.add(new RolloverModifier({
            modifierGroup: "VerticalChartsGroup",
            rolloverLineStroke: appTheme.RolloverLineColor,
        }));
        // surface.renderableSeries.asArray().forEach(rs => {
        //     rs.rolloverModifierProps.tooltipColor = appTheme.RolloverTooltipFill;
        //     rs.rolloverModifierProps.tooltipTextColor = appTheme.RolloverTooltipText;
        // });
    });
});
