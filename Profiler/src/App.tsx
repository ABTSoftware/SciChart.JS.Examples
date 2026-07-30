import * as React from "react";
import { TSciChartPerformanceData } from "scichart";
import { mockData } from "./mockData";
import { PerformanceStatsMonitor, TDebugInfo } from "./PerformanceMonitor/components/PerfromanceGraph";
import { ThemeProvider } from "./ThemeContext";
import { AppBar } from "./AppBar";
import "./theme.css";

const isProd = process.env.NODE_ENV !== "development";
const initialDebugInfo: TDebugInfo = { performanceInfoData: isProd ? [] : [JSON.parse(mockData)] };
export default function App() {
    const [debugInfo, setDebugInfo] = React.useState<TDebugInfo>(undefined);
    const displayStats = !!debugInfo;

    React.useEffect(() => {
        if (isProd) {
            // Listen for messages from the parent
            window.addEventListener("message", event => {
                console.log("event listener:", event.data, event.origin);

                console.log("Received:", event.data);
                const performanceData = event.data.performanceData as TSciChartPerformanceData;
                setDebugInfo(
                    Object.assign({}, debugInfo, {
                        performanceInfoData: [...debugInfo.performanceInfoData, performanceData]
                    })
                );
            });
            console.log("window.opener", window.opener);
            window.opener?.postMessage("Initialized", "*");
        }

        return () => {
            // TODO unsubscribe
        };
    }, []);

    const handleImport = (jsonData: string) => {
        try {
            const performanceData = JSON.parse(jsonData) as TDebugInfo;
            setDebugInfo(performanceData);
        } catch (error) {
            console.error("Failed to import JSON data:", error);
        }
    };

    return (
        <ThemeProvider>
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", margin: 0 }}>
                <AppBar onImport={handleImport} />
                <div style={{ flex: 1, overflow: "auto" }}>
                    {displayStats ? <PerformanceStatsMonitor debugInfo={debugInfo} /> : null}
                </div>
            </div>
        </ThemeProvider>
    );
}
