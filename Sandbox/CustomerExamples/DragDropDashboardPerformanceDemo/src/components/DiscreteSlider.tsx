import React from "react";
import { Slider, Box } from "@mui/material";

interface DiscreteSliderProps {
  value: number;
  onChange: (value: number) => void;
  marks: { value: number; label: string }[];
  values: number[];
}

export function DiscreteSlider({
  value,
  onChange,
  marks,
  values,
}: DiscreteSliderProps) {
  return (
    <Box sx={{ width: 120, mx: 2 }}>
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
