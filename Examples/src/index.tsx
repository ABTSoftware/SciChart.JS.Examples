import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./components/App";
import {
    defaultSourceFilesVariant,
    SourceFilesContext,
} from "./components/AppDetailsRouters/SourceFilesLoading/SourceFilesContext";
import { baseAppPath } from "./constants";
import "./components/Examples/styles/sc-ui.css";

const sourceState = document.getElementById("example-source-state");
const initialSourceFilesVariant = sourceState ? JSON.parse(sourceState.textContent) : defaultSourceFilesVariant;

function Main() {
    return (
        <SourceFilesContext.Provider value={initialSourceFilesVariant}>
            <BrowserRouter basename={baseAppPath}>
                <App />
            </BrowserRouter>
        </SourceFilesContext.Provider>
    );
}

const rootElement = document.querySelector("#react-root");
if (process.env.NODE_ENV === "production") {
    hydrateRoot(rootElement, <Main />);
} else {
    const root = createRoot(rootElement);
    root.render(<Main />);
}
