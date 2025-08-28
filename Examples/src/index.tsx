import React from "react";
import ReactDOM from "react-dom/client";
import VitalSignsMonitorDemo from "./components/Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <div
            style={{
                width: "100vw",
                height: "100vh",
                margin: 0,
                padding: 0,
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
            }}
        >
            <VitalSignsMonitorDemo />
        </div>
    </React.StrictMode>
);
