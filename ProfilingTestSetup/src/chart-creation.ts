import { ChartInitializer } from "./ChartInitializer";
import { SubChartsInitializer } from "./custom/SubChartsInitializer";
import { GraphSummaryInitializer } from "./custom/GraphSummaryInitializer";
import { EInitializerType } from "./InitializerTypes";
import { TTestOptions } from "./types";

let lastPromise: Promise<any> = Promise.resolve();
export const wrapCreation = async (createFunc: () => Promise<any>) => {
    // await lastPromise;
    lastPromise = createFunc();
};

export const getChartInitializer = (options: TTestOptions) => {
    let chartInitializer: ChartInitializer = undefined;
    switch (options.initializerType) {
        case EInitializerType.SubChart: {
            chartInitializer = new SubChartsInitializer(options);
            break;
        }

        case EInitializerType.GraphSummary: {
            chartInitializer = new GraphSummaryInitializer(options);
            break;
        }

        default: {
            chartInitializer = new ChartInitializer(options);
        }
    }

    return chartInitializer;
};
