import React from "react";
import { Slider, Box } from "@mui/material";

const marks = [
  { value: 0, label: "100" },
  { value: 1, label: "1k" },
  { value: 2, label: "10k" },
  { value: 3, label: "100k" },
];

// Map index to actual values
const values = [100, 1000, 10000, 100000];

interface DiscreteSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function LogarithmicSlider({ value, onChange }: DiscreteSliderProps) {
  return (
    <Box sx={{ width: 200, mx: 2 }}>
      <Slider
        value={values.indexOf(value)}
        onChange={(_, newIndex) => onChange(values[newIndex as number])}
        min={0}
        max={3}
        step={null} // Discrete values only
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={(index) => values[index].toLocaleString()}
      />
    </Box>
  );
}
