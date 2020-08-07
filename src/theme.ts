import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import { createMuiTheme } from "@material-ui/core/styles";

export const customTheme = createMuiTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(",")
    },
    palette: {
        primary: green
    }
});
