import * as React from "react";
import classes from "../../../../Examples/Examples.module.scss";
import './OIlGasStyles.css';


export const drawExample = async () => {

};


export default function OilAndGasDashboardShowcase() {

    React.useEffect(() => {
        (async () => {
            // drawExample
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // delete
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div className="sidebar-charts">
                <div id="sidebar-charts-2d" className="sidebar-charts-2d">
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small">
                        <div className="sidebar-charts-2d-title">GR</div>
                        <div className="sidebar-charts-2d-line" style={{position: "relative", top: "15px"}}>
                            <span>0</span>
                            <span style={{paddingLeft: "12px"}}>(GAP)</span>
                            <span>200</span>
                        </div>
                    </div>
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small">
                        <div className="sidebar-charts-2d-title">RHDB</div>
                        <div className="sidebar-charts-2d-line" style={{position: "relative", top: "15px"}}>
                            <span>100</span>
                            <span>(RCI)</span>
                            <span>206</span>
                        </div>
                    </div>
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small">
                        <div className="sidebar-charts-2d-title">NPHI</div>
                        <div className="sidebar-charts-2d-line" style={{position: "relative", top: "15px"}}>
                            <span>0.45</span>
                            <span>(VIV)</span>
                            <span>4.11</span>
                        </div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-first" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-second" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-third" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-fourth" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-fifth" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-sixth" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-seventh" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-eighth" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item">
                        <div id="scichart-2d-ninth" style={{width: "100%", height: "100px", position: "relative"}}></div>
                    </div>
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small"
                         style={{position: "relative", bottom: "15px"}}>
                        <div className="sidebar-charts-2d-line" style={{marginBottom: "20px"}}>
                            <span>0</span>
                            <span style={{paddingLeft: "12px"}}>(GAP)</span>
                            <span>200</span>
                        </div>
                        <div className="sidebar-charts-2d-title">GR</div>
                    </div>
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small"
                         style={{position: "relative", bottom: "15px"}}>
                        <div className="sidebar-charts-2d-line" style={{marginBottom: "20px"}}>
                            <span>100</span>
                            <span>(RCI)</span>
                            <span>206</span>
                        </div>
                        <div className="sidebar-charts-2d-title">RHDB</div>
                    </div>
                    <div className="sidebar-charts-2d-item sidebar-charts-2d-item-small" style={{position: "relative", bottom: "15px"}}>
                        <div className="sidebar-charts-2d-line" style={{marginBottom: "20px"}}>
                            <span>0.45</span>
                            <span>(VIV)</span>
                            <span>4.11</span>
                        </div>
                        <div className="sidebar-charts-2d-title">NPHI</div>
                    </div>
                </div>
                <div className="sidebar-charts-3d">
                    <div id="scichart-3d" style={{position: "relative", height: "100%", width: "100%"}}></div>
                </div>
            </div>
            <div className="main-container">
                <div id="main-charts">
                    <div className="chart-container">
                        <div id="shale-legend" className="legend-root"></div>
                        <div id="shale-chart-background" className="chart-root">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <defs>
                                    <pattern id="grid1" patternUnits="userSpaceOnUse" width="10" height="10">
                                        <line x1="0" y1="0" x2="10" y2="10" stroke="#474747"/>
                                    </pattern>
                                    <pattern id="grid2" patternUnits="userSpaceOnUse" width="10" height="10">
                                        <line x1="0" y1="10" x2="10" y2="0" stroke="#474747"/>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid1)"/>
                                <rect width="100%" height="100%" fill="url(#grid2)"/>
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
