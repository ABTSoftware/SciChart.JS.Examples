import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { customTheme } from "./theme";
import "./components/index.scss";
import { createRoot, hydrateRoot } from "react-dom/client";

function Main() {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <ThemeProvider theme={customTheme}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    );
}

if (process.env.NODE_ENV === "production") {
    hydrateRoot(document.querySelector("#react-root"), <Main />);
} else {
    const root = createRoot(document.querySelector("#react-root"))
    root.render(<Main />);
}
