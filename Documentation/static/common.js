import * as SciChart from "scichart";

SciChart.SciChartSurface.configure({
    dataUrl: "/scichart2d.data",
    wasmUrl: "/scichart2d.wasm"
});
SciChart.SciChart3DSurface.configure({
    dataUrl: "/scichart3d.data",
    wasmUrl: "/scichart3d.wasm"
});
SciChart.SciChartDefaults.performanceWarnings = false;
if (window.location.hostname.includes("scichart")) {
    SciChart.SciChartSurface.setRuntimeLicenseKey(
        "J44gYXzq0TUKahynkWEVf4irTgPc4aP7OsLttSzJ1H6evYTUWwq+N7JLRAjXOhNKycb2maYK1TSuD6iXMK1z8Yr/E/WcJyGhFigwPRuo13DmB7Yyn8zQKa0DmLKLljQFD78uTLFq+XxmZlxMgTl+NsPGCT5ZD62GKAuvTtet8e6r4Psdw37X4GtbpYekhxc8s1aA4bMFanKOzUqnwqRy/CQ2BVbUyj0Q4Ndlvy/tggetQMLcXwbWphBl9dle4QdXxOXLbEdeiO7CO/XOouxEpl+664x6AULNv/Ug1Hdy9bkHLQ8GkN4gNs0q50maboHPLDp6984FtOjsmYB35UUqX5CoaFLoCep9YZ7tL0tZ1RGRci7YPN7mIrfNThWTnBHrRrlGYF9IE/o4kMrgXsoRKdpxmaLSbBxpngRXHJ81roFtxCpND7x4D+dYsaHd/93O1gOc7IFE/zLhqJGKA1sn2C9965E+NV2Mn4nB2dJjTmTci87mN284/8Mvs83dMRiQbI5R69AmDRTVRJb6T6vZWd2k6Z6URTAvymp0UXcYip9gYBwXtlYI3o8WQtapl3Q0AGbTKq7RYS7riylodcVTr3g9oHoLNApto2r4BOIVscXXZSGDWtJpaYZGojc0h3tcAwDby/R3UG5o94sMGC1vZT2WwHeGMkWPxx62Xpg8g+gpB4er91c0NhcGdeIbq0z8sLKIxsSeJ6OH02X/Dc2BXI580xfHsCatMVISJnNVbGvwHmrOXsWO3ZQwv49IU8xE5t7UnxdB3yuKH7VuHtV2khE="
    );
}
