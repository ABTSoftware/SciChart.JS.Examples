import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { customTheme } from "./theme";
import './components/index.scss';

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

ReactDOM.hydrate(<Main />, document.querySelector("#react-root"));
