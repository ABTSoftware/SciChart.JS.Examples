import React, { useContext } from "react";
import { ChartContext } from "./ChartContext";
import "./styles.css";

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
      className={`toggle-button ${
        chartState?.[modifierKey]?.isEnabled ? "active" : ""
      }`}
    >
      {label}
    </button>
  );
};
