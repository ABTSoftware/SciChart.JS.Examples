import React from "react";
import { ChartSpec } from "../ChartPanel/ChartSpec";

interface LabelControlProps {
  label: string;
  checked: boolean;
  propertyName: keyof ChartSpec;
  onChange: (propertyName: string, value: boolean) => void;
}

export const LabelControl: React.FC<LabelControlProps> = ({
  label,
  checked,
  propertyName,
  onChange,
}) => {
  return (
    <label style={{ color: "#333" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(propertyName, e.target.checked)}
      />{" "}
      {label}
    </label>
  );
};
