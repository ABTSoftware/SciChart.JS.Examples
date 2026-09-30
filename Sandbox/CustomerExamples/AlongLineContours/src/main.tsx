import { createRoot } from "react-dom/client";
import { SciChartSurface } from "scichart";
import App from "./App";

SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    wasmNoSimdUrl: "/scichart2d-nosimd.wasm",
});

createRoot(document.getElementById("root")!).render(<App />);
