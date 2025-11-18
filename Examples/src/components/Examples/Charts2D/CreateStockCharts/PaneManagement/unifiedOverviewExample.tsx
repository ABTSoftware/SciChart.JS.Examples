import * as React from "react";
import { Button, Typography, Box, Paper, Grid } from "@mui/material";
import { SciChartReact } from "scichart-react";
import { appTheme } from "../../../theme";
import { 
    drawEnhancedExample, 
    createSampleConfigWithOverview,
    createMultiChartComparisonConfig,
    IEnhancedPaneManagementConfig 
} from "./enhancedDrawExample";
import { 
    runUnifiedOverviewDemo,
    UnifiedOverviewDemo,
    IUnifiedOverviewDemoConfig 
} from "./LayoutManager/unifiedOverviewDemo";

const styles = {
    container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        background: appTheme.DarkIndigo,
        padding: "20px",
    },
    header: {
        marginBottom: "20px",
        color: appTheme.ForegroundColor,
    },
    controlsSection: {
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: appTheme.MutedBlue + "20",
        borderRadius: "8px",
    },
    chartSection: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
        gap: "20px",
    },
    overviewSection: {
        height: "150px",
        backgroundColor: appTheme.MutedBlue + "10",
        borderRadius: "8px",
        padding: "10px",
    },
    mainChartsSection: {
        flex: 1,
        display: "flex",
        gap: "20px",
    },
    subChartsContainer: {
        flex: 1,
        backgroundColor: appTheme.MutedBlue + "10",
        borderRadius: "8px",
        padding: "10px",
    },
    multiChartsContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    },
    multiChart: {
        flex: 1,
        backgroundColor: appTheme.MutedBlue + "10",
        borderRadius: "8px",
        padding: "5px",
    },
    button: {
        margin: "5px",
        backgroundColor: appTheme.VividBlue,
        color: "white",
        "&:hover": {
            backgroundColor: appTheme.VividBlue + "CC",
        },
    },
    infoPanel: {
        padding: "10px",
        backgroundColor: appTheme.MutedBlue + "30",
        borderRadius: "4px",
        marginTop: "10px",
    },
};

export default function UnifiedOverviewExample() {
    const [demo, setDemo] = React.useState<UnifiedOverviewDemo | null>(null);
    const [enhancedExample, setEnhancedExample] = React.useState<any>(null);
    const [demoInfo, setDemoInfo] = React.useState<{
        subCharts: number;
        multiCharts: number;
        totalSeries: number;
    } | null>(null);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [currentRange, setCurrentRange] = React.useState<string>("0 - 1000");

    // Initialize the unified overview demo
    React.useEffect(() => {
        const initializeDemo = async () => {
            try {
                // Configuration for the unified demo
                const demoConfig: IUnifiedOverviewDemoConfig = {
                    overviewDivId: "unified-overview",
                    subChartContainerDivId: "subchart-container",
                    multiChart1DivId: "multichart-1",
                    multiChart2DivId: "multichart-2",
                    multiChart3DivId: "multichart-3",
                };

                // Initialize the unified overview demo
                const demoInstance = await runUnifiedOverviewDemo();
                setDemo(demoInstance);

                // Get demo information
                const info = demoInstance.getChartInfo();
                setDemoInfo(info);

                // Configuration for the enhanced pane management example
                const enhancedConfig = createSampleConfigWithOverview("enhanced-overview");
                
                // Initialize enhanced example
                const enhancedInstance = await drawEnhancedExample("enhanced-pane-container", enhancedConfig);
                setEnhancedExample(enhancedInstance);

                setIsInitialized(true);
                console.log("Unified Overview Example initialized successfully");
            } catch (error) {
                console.error("Failed to initialize Unified Overview Example:", error);
            }
        };

        initializeDemo();

        // Cleanup on unmount
        return () => {
            if (demo) {
                demo.cleanup();
            }
            if (enhancedExample?.sciChartSurface) {
                enhancedExample.sciChartSurface.delete();
            }
        };
    }, []);

    // Update current range display
    React.useEffect(() => {
        if (!demo) return;

        const updateRange = () => {
            const range = demo.getOverviewManager().getVisibleRange();
            if (range) {
                setCurrentRange(`${range.min.toFixed(0)} - ${range.max.toFixed(0)}`);
            }
        };

        // Update range initially
        updateRange();

        // Set up interval to update range display
        const interval = setInterval(updateRange, 1000);
        return () => clearInterval(interval);
    }, [demo]);

    const handleZoomIn = () => {
        if (demo) {
            const currentRange = demo.getOverviewManager().getVisibleRange();
            if (currentRange) {
                const center = (currentRange.min + currentRange.max) / 2;
                const newDiff = (currentRange.max - currentRange.min) * 0.7;
                
                // Import NumberRange dynamically
                import("scichart").then(({ NumberRange }) => {
                    const newRange = new NumberRange(center - newDiff / 2, center + newDiff / 2);
                    demo.getOverviewManager().setVisibleRange(newRange);
                });
            }
        }
    };

    const handleZoomOut = () => {
        if (demo) {
            const currentRange = demo.getOverviewManager().getVisibleRange();
            if (currentRange) {
                const center = (currentRange.min + currentRange.max) / 2;
                const newDiff = (currentRange.max - currentRange.min) * 1.4;
                
                // Import NumberRange dynamically
                import("scichart").then(({ NumberRange }) => {
                    const newRange = new NumberRange(center - newDiff / 2, center + newDiff / 2);
                    demo.getOverviewManager().setVisibleRange(newRange);
                });
            }
        }
    };

    const handleResetZoom = () => {
        if (demo) {
            import("scichart").then(({ NumberRange }) => {
                demo.getOverviewManager().setVisibleRange(new NumberRange(0, 1000));
            });
        }
    };

    const handleDemonstrateRanges = () => {
        if (demo) {
            demo.demonstrateRangeChanges();
        }
    };

    const handleToggleSync = () => {
        if (demo) {
            const charts = demo.getOverviewManager().getCharts();
            const firstChart = Array.from(charts.values())[0];
            
            if (firstChart) {
                const currentlyActive = firstChart.isActive;
                demo.getOverviewManager().setChartSyncEnabled(firstChart.id, !currentlyActive);
                console.log(`Chart ${firstChart.id} sync ${!currentlyActive ? 'enabled' : 'disabled'}`);
            }
        }
    };

    const handleAddTradingChart = async () => {
        if (enhancedExample) {
            const { EChartType } = await import("./LayoutManager/chartManager");
            const tradingTypes = [EChartType.PriceChart, EChartType.MacdChart, EChartType.RsiChart];
            const randomType = tradingTypes[Math.floor(Math.random() * tradingTypes.length)];
            
            await enhancedExample.addChart({ chartType: randomType });
        }
    };

    const handleRemoveChart = () => {
        if (enhancedExample) {
            const config = enhancedExample.getConfiguration();
            const lastIndex = (config.charts?.length ?? 1) - 1;
            if (lastIndex >= 0) {
                enhancedExample.removeChart(lastIndex);
            }
        }
    };

    if (!isInitialized) {
        return (
            <div style={styles.container}>
                <Typography variant="h4" style={styles.header}>
                    Loading Unified Overview Example...
                </Typography>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Typography variant="h4" style={styles.header}>
                Unified Overview SubChart API Demo
            </Typography>
            
            <Typography variant="body1" style={{ color: appTheme.ForegroundColor, marginBottom: "20px" }}>
                This example demonstrates the unified Overview SubChart API that works with both SubCharts and MultiCharts.
                The overview at the top synchronizes with all charts below, regardless of their implementation type.
            </Typography>

            {/* Controls Section */}
            <Paper style={styles.controlsSection}>
                <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                    Overview Controls
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
                    <Button variant="contained" style={styles.button} onClick={handleZoomIn}>
                        Zoom In
                    </Button>
                    <Button variant="contained" style={styles.button} onClick={handleZoomOut}>
                        Zoom Out
                    </Button>
                    <Button variant="contained" style={styles.button} onClick={handleResetZoom}>
                        Reset Zoom
                    </Button>
                    <Button variant="contained" style={styles.button} onClick={handleDemonstrateRanges}>
                        Demo Ranges
                    </Button>
                    <Button variant="contained" style={styles.button} onClick={handleToggleSync}>
                        Toggle Sync
                    </Button>
                </Box>

                <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                    Chart Management
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={1}>
                    <Button variant="contained" style={styles.button} onClick={handleAddTradingChart}>
                        Add Trading Chart
                    </Button>
                    <Button variant="contained" style={styles.button} onClick={handleRemoveChart}>
                        Remove Chart
                    </Button>
                </Box>

                {/* Info Panel */}
                {demoInfo && (
                    <Box style={styles.infoPanel}>
                        <Typography variant="body2" style={{ color: appTheme.ForegroundColor }}>
                            <strong>Demo Stats:</strong> {demoInfo.subCharts} SubCharts, {demoInfo.multiCharts} MultiCharts, 
                            {demoInfo.totalSeries} Total Series | <strong>Current Range:</strong> {currentRange}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Charts Section */}
            <div style={styles.chartSection}>
                {/* Overview Section */}
                <Paper style={styles.overviewSection}>
                    <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                        Unified Overview (Synchronizes All Charts)
                    </Typography>
                    <div id="unified-overview" style={{ width: "100%", height: "100px" }} />
                </Paper>

                {/* Main Charts Section */}
                <div style={styles.mainChartsSection}>
                    {/* SubCharts Container */}
                    <Paper style={styles.subChartsContainer}>
                        <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                            SubCharts (Single Surface with Sub-surfaces)
                        </Typography>
                        <div id="subchart-container" style={{ width: "100%", height: "calc(100% - 40px)" }} />
                    </Paper>

                    {/* MultiCharts Container */}
                    <div style={styles.multiChartsContainer}>
                        <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                            MultiCharts (Independent Surfaces)
                        </Typography>
                        
                        <Paper style={styles.multiChart}>
                            <div id="multichart-1" style={{ width: "100%", height: "100%" }} />
                        </Paper>
                        
                        <Paper style={styles.multiChart}>
                            <div id="multichart-2" style={{ width: "100%", height: "100%" }} />
                        </Paper>
                        
                        <Paper style={styles.multiChart}>
                            <div id="multichart-3" style={{ width: "100%", height: "100%" }} />
                        </Paper>
                    </div>
                </div>
            </div>

            {/* Enhanced Pane Management Section */}
            <Paper style={{ ...styles.overviewSection, height: "300px", marginTop: "20px" }}>
                <Typography variant="h6" style={{ color: appTheme.ForegroundColor, marginBottom: "10px" }}>
                    Enhanced Pane Management with Overview
                </Typography>
                <div style={{ display: "flex", height: "calc(100% - 40px)", gap: "10px" }}>
                    <div style={{ width: "25%", minWidth: "200px" }}>
                        <div id="enhanced-overview" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div id="enhanced-pane-container" style={{ width: "100%", height: "100%" }} />
                    </div>
                </div>
            </Paper>

            {/* Demo Controls Container */}
            <div id="demo-controls" style={{ display: "none" }} />
        </div>
    );
}