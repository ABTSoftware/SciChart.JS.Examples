import { cyan } from "@mui/material/colors"; // Correct way to import colors in MUI v5
import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
    spacing: (factor: number) => `${factor * 0.5}rem`,
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
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
        fontFamily: "var(--sc-font-family)",
        h1: { fontSize: "var(--sc-font-size-xl)", fontWeight: 600 },
        h2: { fontSize: "var(--sc-font-size-lg)", fontWeight: 600 },
        h3: { fontSize: "var(--sc-font-size-lg)", fontWeight: 600 },
        h4: { fontSize: "var(--sc-font-size-base)", fontWeight: 600 },
        h5: { fontSize: "var(--sc-font-size-base)", fontWeight: 600 },
        h6: { fontSize: "var(--sc-font-size-base)", fontWeight: 600 },
        body1: { fontSize: "var(--sc-font-size-base)" },
        body2: { fontSize: "var(--sc-font-size-sm)" },
        subtitle1: { fontSize: "var(--sc-font-size-base)" },
        subtitle2: { fontSize: "var(--sc-font-size-sm)" },
        button: { fontSize: "var(--sc-font-size-sm)", textTransform: "none" },
        caption: { fontSize: "var(--sc-font-size-xs)" },
        overline: { fontSize: "var(--sc-font-size-xs)", textTransform: "none" },
    },
    palette: {
        primary: {
            main: cyan[500], // Use the 'main' key for the primary color
        },
    },
});
