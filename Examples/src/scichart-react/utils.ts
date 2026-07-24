import { useRef, useEffect } from "react";
import { generateGuid, ISciChartSurfaceBase, TSurfaceDefinition, chartBuilder, SciChart3DSurface, ESciChartSurfaceType, ISciChart3DDefinition, SciChartPieSurface, ISciChartPieDefinition, ISciChart2DDefinition, SciChartSurface, SciChartPolarSurface } from "scichart";
import { TInitFunction } from "./types";

export const useIsMountedRef = () => {
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
};

export const createChartRoot = () => {
    const internalRootElement = document.createElement("div");
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = "100%";
    internalRootElement.style.height = "100%";
    return internalRootElement;
};

export function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(
    config: string | TSurfaceDefinition
): TInitFunction<TSurface> {
    return async (chartRoot: string | HTMLDivElement) => {
        // Potentially should return 2D, 3D, or Pie Chart
        // TODO add better type handling
        const chart = (await chartBuilder.buildChart(chartRoot, config as string)) as any;
        if ("sciChartSurface" in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface as TSurface };
        } else if ("sciChart3DSurface" in chart) {
            // 3D Chart
            return { sciChartSurface: chart.sciChart3DSurface as TSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart as TSurface };
        }
    };
}
