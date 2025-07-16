import * as SciChart from "scichart";

SciChart.SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm"
});
SciChart.SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm"
});
SciChart.SciChartDefaults.performanceWarnings = false;
if (window.location.hostname.includes("scichart")) {
    SciChart.SciChartSurface.setRuntimeLicenseKey(
        "f73WgvARpprIvfm0FJJ2AxbYnQepAOTy2hGhxIUtaMEy4zrxL0IiSkhEUE5P56kdKDwi3YQ62ZrfBmu84+9ZJlcPKi3DF/toHtxTC4LCviZedGeDTm/sXNDEiXSNk+Ocy/uswC9zuC9D0o9juTohnFJo3M0R4DgOurbcOVEndQEL6GrpzO64BF5gK4dKT+f4QCfqraMYLGQZ5MbtS3BCjuYzyrmkHlBFJvbzxUzXjbF4AOmk4a9iFVLgeDYEkUYc/v5QWABzbQwsOBO1zaYJ39v2WWoaBgwtehSS1GUWlqKGk5REi28tiY0zMsN9kmM/XkLcLxgvYM1ICiusDYyvOpivcDmhmXBHIaIWh+WdbARNfQD3nd96CmxPUoQ0V0sB/aFXWxj0afAqysSx0/mp/FPo3HqH2hcCSHFbF8uGdAnvU0XMJSHrAhuwm8dWgGHYmj6Yr3hVu0uOQbWGfKeV/L1GyG8A+N9bDaP1wmsSTp3B6F3VeV3f+Cq5QIw6Vv4KHseX9UuislUrdS9inyMEz51kqIn5H2pRQcHSFR65vTk2jwDhucVFo99f8mByQYwxvUkDz9UWTVHMxUFjDjFQilHXg4zklkRcu0soqIxBMtjG/u/7iFRw2049V4q1erSdszD/WVNerjaTVKB8lxkebqW/o0uzrOf9ha7QQWXT2QdkViNU9i7sdMexvsJN6XTNK/qxx+amTS9WMXEgZMkebfeSoxc3caU48vZ/xPh+eR1qzrpKbuupO3OQ0h/1aETrChWI64MphKwlmSkGNfks2Px0hL5bGzgdVXTBRRGKebZf9vxs3OcmiXwHsc+CWhyLeU++wmxi8YKNmmnxyiE9NCw2hNL6Lcc0gHzovGWG/87ONH62rO0fz9ma3cr43ZQ3"
    );
}
