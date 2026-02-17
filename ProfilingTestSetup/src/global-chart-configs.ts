import {
    SciChartSurfaceBase,
    SciChartJsNavyTheme,
    MemoryUsageHelper,
    PerformanceDebugHelper,
    EPerformanceDebugLevel,
    SciChartSurface,
    SciChart3DSurface,
    SciChartDefaults,
    labelCache
} from "scichart";

SciChartSurfaceBase.DEFAULT_THEME = new SciChartJsNavyTheme();

// if (process.env.NODE_ENV === "development") {
//     MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
// }
PerformanceDebugHelper.enableDebug = false;
PerformanceDebugHelper.debugLevel = EPerformanceDebugLevel.Verbose;
SciChartSurface.autoDisposeWasmContext = false;
SciChart3DSurface.autoDisposeWasmContext = false;
SciChartDefaults.useNativeText = true;
SciChartDefaults.useSharedCache = true;
// labelCache.setMaxSize(2000);

// SciChartSurface.loadWasmFromCDN()
// SciChart3DSurface.loadWasmFromCDN()

SciChartSurface.UseCommunityLicense();

// TODO licensing
SciChartSurface.setRuntimeLicenseKey(
    "vKDX7ja5+wmviLuPuhpaobTXdAMmjPVi1uwA+K4tag//NceYJF4LqabhfRc8an4bqPveFM9aQ5/FfvDYDCwtIrtEQhh2zoQTEd5HJ3RemxjSkhdlswTvaJ1n+BtIG43yvizHoE3LuqUUnWsMFeoGtROKDBt1jnjHtQwEBF6GydTCGGjRMIH69lgkUsoeOoUVal3v6DgyN2OkaSgvD0Qr4oACM5ZuyaT1jBQSlV3Qf65EAojUFfjYGVnXxUB0A/viJ4BR2L5xpqsm2YfttfOznw3n+nM+ArZnMQ8wOaNBUPBnxZTGv88yqId5GDgRXdXZvR4icihbJpnQnhXmIhDL9OUAZ2yo0Z8R8chrAQjML4+wMGCW/iM//BOqkAUxNw2z2sxnaLmtC8fs8TuizRnvSD0OwbJnkpSvJh+cwkaOevGbrWWlzUiMDzYo8mu3TJ3qgAEH1BGcEtc+RY+UHZSz7dTiZMjhI8GkA9Nopena0VyP8mBQLAxO1QVb1bsu68y7mJIpnojvjOBbj2uWwC7vgjQMa+5+Vnuaue2SkgEfGwAW+XGWiVzjLvfM/vYP7c0ex+7KG2nwPd3qvg=="
);

SciChart3DSurface.setRuntimeLicenseKey(
    "vKDX7ja5+wmviLuPuhpaobTXdAMmjPVi1uwA+K4tag//NceYJF4LqabhfRc8an4bqPveFM9aQ5/FfvDYDCwtIrtEQhh2zoQTEd5HJ3RemxjSkhdlswTvaJ1n+BtIG43yvizHoE3LuqUUnWsMFeoGtROKDBt1jnjHtQwEBF6GydTCGGjRMIH69lgkUsoeOoUVal3v6DgyN2OkaSgvD0Qr4oACM5ZuyaT1jBQSlV3Qf65EAojUFfjYGVnXxUB0A/viJ4BR2L5xpqsm2YfttfOznw3n+nM+ArZnMQ8wOaNBUPBnxZTGv88yqId5GDgRXdXZvR4icihbJpnQnhXmIhDL9OUAZ2yo0Z8R8chrAQjML4+wMGCW/iM//BOqkAUxNw2z2sxnaLmtC8fs8TuizRnvSD0OwbJnkpSvJh+cwkaOevGbrWWlzUiMDzYo8mu3TJ3qgAEH1BGcEtc+RY+UHZSz7dTiZMjhI8GkA9Nopena0VyP8mBQLAxO1QVb1bsu68y7mJIpnojvjOBbj2uWwC7vgjQMa+5+Vnuaue2SkgEfGwAW+XGWiVzjLvfM/vYP7c0ex+7KG2nwPd3qvg=="
);
