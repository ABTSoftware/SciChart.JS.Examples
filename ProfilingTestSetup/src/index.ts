// settings fir SciChartDefaults, static properties, logging
import "./global-chart-configs";

// subscribing UI control elements to chart manipulations
import { initializeControlBindings } from "./control-bindings";

// Initialize control bindings after DOM is loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initializeControlBindings());
} else {
    // DOM is already loaded
    initializeControlBindings();
}
