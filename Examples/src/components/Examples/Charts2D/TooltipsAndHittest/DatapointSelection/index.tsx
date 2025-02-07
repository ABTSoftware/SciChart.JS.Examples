import { useRef, useState, CSSProperties } from "react";
import commonClasses from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";
import { SciChartReact } from "scichart-react";
import { DataPointInfo } from "scichart";
import { drawExample } from "./drawExample";
import { useViewType } from "../../../containerSizeHooks";

export default function DatapointSelection() {
    const [selectedPoints, setSelectedPoints] = useState<DataPointInfo[]>([]);

    const viewRef = useRef<HTMLDivElement>(null);
    const viewInfo = useViewType(viewRef);
    const { isLargeView, isMobileView } = viewInfo ?? {};

    return (
        <div
            ref={viewRef}
            className={commonClasses.ChartWrapper}
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
        >
            <SciChartReact
                style={chartStyle}
                initChart={(rootElement) => drawExample(rootElement, setSelectedPoints)}
            />
            {!isMobileView ? (
                <div style={pointsBoxStyle}>
                    <h3 style={{ color: appTheme.PaleSkyBlue, margin: 5 }}>Selected Points</h3>
                    <div style={{ ...rowStyle, marginRight: "17px" }}>
                        <div style={columnItemStyle}>Series Name</div>
                        <div style={columnItemStyle}>X Value</div>
                        <div style={columnItemStyleRight}>Y Value</div>
                    </div>
                    <div style={scrollbarStyle}>
                        {selectedPoints.map((dp, index) => (
                            <div style={rowStyle}>
                                <div style={columnItemStyle}>{dp.seriesName}</div>
                                <div style={columnItemStyle}>{dp.xValue.toFixed(2)}</div>
                                <div style={columnItemStyleRight}>{dp.yValue.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

const rowStyle = {
    height: "30px",
    display: "flex",
};

const pointsBoxStyle: CSSProperties = {
    flexBasis: 70,
    flexGrow: 1,
    flexShrink: 1,
    color: appTheme.PaleSkyBlue,
    background: appTheme.DarkIndigo,
};

const chartStyle: CSSProperties = {
    flexBasis: 400,
    flexGrow: 1,
    flexShrink: 1,
};

const columnItemStyle: CSSProperties = {
    flex: "auto",
    width: "100px",
    borderRight: `solid 1px ${appTheme.MutedSkyBlue}`,
    borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
    textAlign: "center",
    fontSize: 14,
};
const columnItemStyleRight: CSSProperties = {
    flex: "auto",
    width: "100px",
    borderBottom: `solid 1px ${appTheme.MutedSkyBlue}`,
    textAlign: "center",
    fontSize: 14,
};

const scrollbarStyle: CSSProperties = {
    height: "100%",
    overflow: "scroll",
    overflowX: "hidden",
};
