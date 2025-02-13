import React from "react";

const ChartLoader: React.FC = () => {
  return (
    <div
      style={{
        background: "radial-gradient(circle, #22365B 0%, #17243d 100%)",
        color: "#8398ba",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading...
    </div>
  );
};

export default ChartLoader;
