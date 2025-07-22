import commonClasses from "../../../styles/Examples.module.scss";
import "./OIlGasStyles.css";

import { SciChart3DSurface, SciChartSurface, SciChartVerticalGroup } from "scichart";
import init3dChart from "./charts/3d";
import init2dFirstChart from "./charts/2dcharts/first";
import init2dSecondChart from "./charts/2dcharts/second";
import init2dThirdChart from "./charts/2dcharts/third";
import init2dFourthChart from "./charts/2dcharts/fourth";
import init2dFifthChart from "./charts/2dcharts/fifth";
import init2dSixthChart from "./charts/2dcharts/sixth";
import init2dSeventhChart from "./charts/2dcharts/seventh";
import init2dEighthChart from "./charts/2dcharts/eighth";
import init2dNinthChart from "./charts/2dcharts/ninth";
import { appTheme } from "./theme";
import { RolloverModifier } from "scichart";
import { drawDensityChart } from "./charts/VerticalCharts/DensityChart";
import { drawPoreSpaceChart } from "./charts/VerticalCharts/PoreSpaceChart";
import { drawResistivityChart } from "./charts/VerticalCharts/ResistivityChart";
import { drawShaleChart } from "./charts/VerticalCharts/ShaleChart";
import { drawSonicChart } from "./charts/VerticalCharts/SonicChart";
import { drawTextureChart } from "./charts/VerticalCharts/TextureChart";
import { IInitResult, SciChartReact } from "scichart-react";
import { ChartGroupLoader } from "scichart-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const onInitAllCharts = (initResults: IInitResult[]) => {
    const verticalChartIds = [
        "densityChart",
        "textureChart",
        "poreSpaceChart",
        "resistivityChart",
        "shaleChart",
        "sonicChart",
    ];

    const verticalCharts = initResults.filter(({ sciChartSurface }) =>
        verticalChartIds.includes(sciChartSurface.id)
    ) as IInitResult<SciChartSurface>[];

    const surfaceGroup = new SciChartVerticalGroup();

    verticalCharts.forEach(({ sciChartSurface }) => {
        surfaceGroup.addSurfaceToGroup(sciChartSurface);
        sciChartSurface.chartModifiers.add(
            new RolloverModifier({
                modifierGroup: "VerticalChartsGroup",
                rolloverLineStroke: appTheme.RolloverLineColor,
            })
        );
        // surface.renderableSeries.asArray().forEach(rs => {
        //     rs.rolloverModifierProps.tooltipColor = appTheme.RolloverTooltipFill;
        //     rs.rolloverModifierProps.tooltipTextColor = appTheme.RolloverTooltipText;
        // });
    });
};

export default function OilAndGasDashboardShowcase() {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("md")); // Mobile view
    return (
        <ChartGroupLoader className={commonClasses.ChartWrapper} style={{ display: "flex" }} onInit={onInitAllCharts}>
            {isXs ? null : (
                <div className="sidebar-charts">
                    <div
                        id="sidebar-charts-2d"
                        className="sidebar-charts-2d"
                        style={{ background: appTheme.SidebarBackground, color: appTheme.SidebarTextColor }}
                    >
                        <div className="sidebar-charts-2d-title-container">
                            <div className="sidebar-charts-2d-title-item sidebar-charts-2d-item sidebar-charts-2d-item-small">
                                <div className="sidebar-charts-2d-title">GR</div>
                                <div className="sidebar-charts-2d-line">
                                    <div>0</div>
                                    <div>(GAP)</div>
                                    <div>200</div>
                                </div>
                            </div>
                            <div className="sidebar-charts-2d-title-item sidebar-charts-2d-item sidebar-charts-2d-item-small">
                                <div className="sidebar-charts-2d-title">RHDB</div>
                                <div className="sidebar-charts-2d-line">
                                    <div>100</div>
                                    <div>(RCI)</div>
                                    <div>206</div>
                                </div>
                            </div>
                            <div className="sidebar-charts-2d-title-item sidebar-charts-2d-item sidebar-charts-2d-item-small">
                                <div className="sidebar-charts-2d-title">NPHI</div>
                                <div className="sidebar-charts-2d-line">
                                    <div>0.45</div>
                                    <div>(VIV)</div>
                                    <div>4.11</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid-container">
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dFirstChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dSecondChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dThirdChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dFourthChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dFifthChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dSixthChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dSeventhChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dEighthChart} />
                            <SciChartReact className="sidebar-charts-2d-item" initChart={init2dNinthChart} />
                        </div>
                    </div>
                    <SciChartReact<SciChart3DSurface>
                        className="sidebar-charts-3d"
                        initChart={init3dChart}
                    ></SciChartReact>
                </div>
            )}
            <div className="main-container">
                <div
                    id="main-charts"
                    style={{ background: appTheme.SidebarBackground, color: appTheme.SidebarTextColor }}
                >
                    <div className="chart-container">
                        <div id="shale-legend" className="legend-root"></div>
                        <div
                            id="shale-chart-background"
                            className="chart-root"
                            style={{
                                background: appTheme.ShaleBackgroundColor,
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <defs>
                                    <pattern id="grid1" patternUnits="userSpaceOnUse" width="10" height="10">
                                        <line x1="0" y1="0" x2="10" y2="10" stroke="#474747" />
                                    </pattern>
                                    <pattern id="grid2" patternUnits="userSpaceOnUse" width="10" height="10">
                                        <line x1="0" y1="10" x2="10" y2="0" stroke="#474747" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid1)" />
                                <rect width="100%" height="100%" fill="url(#grid2)" />
                            </svg>
                        </div>
                        <SciChartReact className="chart-root" initChart={drawShaleChart}></SciChartReact>
                    </div>
                    <div className="chart-container">
                        <div id="density-legend" className="legend-root"></div>
                        <SciChartReact className="chart-root" initChart={drawDensityChart}></SciChartReact>
                    </div>
                    <div className="chart-container">
                        <div id="resistivity-legend" className="legend-root"></div>
                        <SciChartReact className="chart-root" initChart={drawResistivityChart}></SciChartReact>
                    </div>
                    <div className="chart-container">
                        <div id="pore-space-legend" className="legend-root"></div>
                        <SciChartReact className="chart-root" initChart={drawPoreSpaceChart}></SciChartReact>
                    </div>
                    <div className="chart-container">
                        <div id="sonic-legend" className="legend-root"></div>
                        <SciChartReact className="chart-root" initChart={drawSonicChart}></SciChartReact>
                    </div>
                    <div className="chart-container">
                        <div id="texture-legend" className="legend-root"></div>
                        <SciChartReact className="chart-root" initChart={drawTextureChart}></SciChartReact>
                    </div>
                </div>
            </div>
        </ChartGroupLoader>
    );
}
