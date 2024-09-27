import { cyan } from "@mui/material/colors"; // Correct way to import colors in MUI v5
import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1460,
            xl: 1920,
        },
    },
    typography: {
        fontFamily: [
            "Montserrat",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
    },
    palette: {
        primary: {
            main: cyan[500], // Use the 'main' key for the primary color
        },
    },
});
