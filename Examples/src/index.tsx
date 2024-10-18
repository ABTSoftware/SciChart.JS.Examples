import { useEffect } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { customTheme } from "./theme";
import "./components/index.scss";

function Main() {
    useEffect(() => {
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

const rootElement = document.querySelector("#react-root");
if (process.env.NODE_ENV === "production") {
    hydrateRoot(rootElement, <Main />);
} else {
    const root = createRoot(rootElement);
    root.render(<Main />);
}
