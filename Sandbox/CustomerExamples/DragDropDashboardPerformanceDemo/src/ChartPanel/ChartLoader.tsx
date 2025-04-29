import React from "react";

interface ChartLoaderProps {
  text?: string;
}

const ChartLoader: React.FC<ChartLoaderProps> = ({ text = "Loading..." }) => {
  return (
    <div
      style={{
        background: "radial-gradient(circle, #22365B 0%, #17243d 100%)",
        color: "#8398ba",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25em",
      }}
    >
      {text}
    </div>
  );
};

export default ChartLoader;
