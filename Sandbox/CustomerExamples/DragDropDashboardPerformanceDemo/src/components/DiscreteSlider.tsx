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
    <Box sx={{ width: 120, mx: 10, marginLeft: "20px", marginRight: "20px" }}>
      <Slider
        sx={{
          "& .MuiSlider-markLabel": {
            fontSize: "0.75rem",
          },
        }}
        value={values.indexOf(value)}
        onChange={(_, newIndex) => onChange(values[newIndex as number])}
        min={0}
        max={3}
        step={null} // Discrete values only
        marks={marks}
        valueLabelDisplay="on"
        valueLabelFormat={(index) => values[index].toLocaleString()}
      />
    </Box>
  );
}
