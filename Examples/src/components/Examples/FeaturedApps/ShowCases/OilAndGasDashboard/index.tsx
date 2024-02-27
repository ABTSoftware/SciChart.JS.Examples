import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import "./OIlGasStyles.css";

import { SciChartVerticalGroup } from "scichart";
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
import { SciChartSurfaceBase } from "scichart";
import { RolloverModifier } from "scichart";
import { drawDensityChart } from "./charts/VerticalCharts/DensityChart";
import { drawPoreSpaceChart } from "./charts/VerticalCharts/PoreSpaceChart";
import { drawResistivityChart } from "./charts/VerticalCharts/ResistivityChart";
import { drawShaleChart } from "./charts/VerticalCharts/ShaleChart";
import { drawSonicChart } from "./charts/VerticalCharts/SonicChart";
import { drawTextureChart } from "./charts/VerticalCharts/TextureChart";

const drawExample = async () => {
    const charts = {
        gr: "scichart-gr",
        rhdb: "scichart-rhdb",
        nphi: "scichart-nphi",
        dt: "scichart-dt",
        lld: "scichart-lld",
        vsh: "scichart-vsh",
        "3d": "scichart-3d",
        "2dFirst": "scichart-2d-first",
        "2dSecond": "scichart-2d-second",
        "2dThird": "scichart-2d-third",
        "2dFourth": "scichart-2d-fourth",
        "2dFifth": "scichart-2d-fifth",
        "2dSixth": "scichart-2d-sixth",
        "2dSeventh": "scichart-2d-seventh",
        "2dEighth": "scichart-2d-eighth",
        "2dNinth": "scichart-2d-ninth",
    };

    const sidebar2d = document.getElementById("sidebar-charts-2d");
    sidebar2d.style.background = appTheme.SidebarBackground;
    sidebar2d.style.color = appTheme.SidebarTextColor;

    const mainCharts = document.getElementById("main-charts");
    mainCharts.style.background = appTheme.SidebarBackground;
    mainCharts.style.color = appTheme.SidebarTextColor;

    const shaleChartBackground = document.getElementById("shale-chart-background");
    shaleChartBackground.style.backgroundColor = appTheme.ShaleBackgroundColor;

    const initSideBarCharts = async () =>
        Promise.all([
            init2dFirstChart(charts["2dFirst"]),
            init2dSecondChart(charts["2dSecond"]),
            init2dThirdChart(charts["2dThird"]),
            init2dFourthChart(charts["2dFourth"]),
            init2dFifthChart(charts["2dFifth"]),
            init2dSixthChart(charts["2dSixth"]),
            init2dSeventhChart(charts["2dSeventh"]),
            init2dEighthChart(charts["2dEighth"]),
            init2dNinthChart(charts["2dNinth"]),
            init3dChart(charts["3d"]),
        ]);

    const surfaceGroup = new SciChartVerticalGroup();

    const initVerticalCharts = () =>
        Promise.all([
            drawShaleChart(),
            drawDensityChart(),
            drawResistivityChart(),
            drawPoreSpaceChart(),
            drawSonicChart(),
            drawTextureChart(),
        ]).then((surfaces) => {
            surfaces.forEach((surface) => {
                surfaceGroup.addSurfaceToGroup(surface);
                surface.chartModifiers.add(
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

            return surfaces;
        });

    const [verticalCharts, sidebarCharts] = await Promise.all([initSideBarCharts(), initVerticalCharts()]);

    return [...verticalCharts, ...sidebarCharts];
};

export default function OilAndGasDashboardShowcase() {
    const surfacesRef = React.useRef<SciChartSurfaceBase[]>();

    React.useEffect(() => {
        const initChartsPromise = drawExample();
        initChartsPromise.then((surfaces) => (surfacesRef.current = surfaces));

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            initChartsPromise.then((surfaces) => surfaces.forEach((scs) => scs.delete()));
            surfacesRef.current = null;
        };
    }, []);

    return (
        <div className={classes.ChartWrapper} style={{ display: "flex" }}>
            <div className="sidebar-charts">
                <div id="sidebar-charts-2d" className="sidebar-charts-2d">
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
                        <div className="sidebar-charts-2d-item" id="scichart-2d-first"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-second"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-third"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-fourth"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-fifth"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-sixth"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-seventh"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-eighth"></div>
                        <div className="sidebar-charts-2d-item" id="scichart-2d-ninth"></div>
                    </div>
                </div>
                <div className="sidebar-charts-3d" id="scichart-3d"></div>
            </div>
            <div className="main-container">
                <div id="main-charts">
                    <div className="chart-container">
                        <div id="shale-legend" className="legend-root"></div>
                        <div id="shale-chart-background" className="chart-root">
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
                        <div id="shale-chart" className="chart-root"></div>
                    </div>
                    <div className="chart-container">
                        <div id="density-legend" className="legend-root"></div>
                        <div id="density-chart" className="chart-root"></div>
                    </div>
                    <div className="chart-container">
                        <div id="resistivity-legend" className="legend-root"></div>
                        <div id="resistivity-chart" className="chart-root"></div>
                    </div>
                    <div className="chart-container">
                        <div id="pore-space-legend" className="legend-root"></div>
                        <div id="pore-space-chart" className="chart-root"></div>
                    </div>
                    <div className="chart-container">
                        <div id="sonic-legend" className="legend-root"></div>
                        <div id="sonic-chart" className="chart-root"></div>
                    </div>
                    <div className="chart-container">
                        <div id="texture-legend" className="legend-root"></div>
                        <div id="texture-chart" className="chart-root"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
