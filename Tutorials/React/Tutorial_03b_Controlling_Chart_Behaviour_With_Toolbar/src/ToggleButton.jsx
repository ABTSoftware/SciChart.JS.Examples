import React, { useContext } from "react";
import { ChartContext } from "./ChartContext";

export const ToggleButton = ({ label, modifierKey }) => {
  const { chartState, setChartState } = useContext(ChartContext);

  const handleClick = () => {
    if (!chartState) return;

    const { sciChartSurface, ...modifiers } = chartState;

    // Disable all modifiers
    Object.values(modifiers).forEach((modifier) => {
      modifier.isEnabled = false;
    });

    // Enable only the clicked modifier
    modifiers[modifierKey].isEnabled = true;

    // Update state
    setChartState({ ...chartState });

    console.log(`${modifierKey} is now enabled`);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: chartState?.[modifierKey]?.isEnabled
          ? "#007AFF"
          : "#E0E0E0", // Blue when active, light gray when inactive
        color: chartState?.[modifierKey]?.isEnabled ? "white" : "#333",
        border: "none",
        padding: "8px 16px",
        borderRadius: "2px", // Slightly rounded edges
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
        boxShadow: chartState?.[modifierKey]?.isEnabled
          ? "0 2px 5px rgba(0, 122, 255, 0.5)"
          : "0 1px 3px rgba(0, 0, 0, 0.2)",
        outline: "none",
      }}
    >
      {label}
    </button>
  );
};
