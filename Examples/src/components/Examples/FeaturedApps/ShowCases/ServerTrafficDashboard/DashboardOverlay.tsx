import * as React from "react";
import { appTheme } from "../../../theme";

const DashboardOverlay = () => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                backgroundColor: "#242529",
                top: 0,
                left: 0,
                zIndex: 3,
                width: "100%",
                height: "100%",
                fontSize: 50,
                color: appTheme.ForegroundColor,
                textAlign: "center",
                verticalAlign: "middle",
                justifyContent: "stretch",
            }}
        >
            <div style={{ flex: "auto" }}> Loading...</div>
        </div>
    );
};

export default DashboardOverlay;
