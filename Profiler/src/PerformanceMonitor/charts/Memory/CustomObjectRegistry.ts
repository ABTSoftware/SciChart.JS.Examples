import { ObjectRegistry, IDataChangeArgs, MemoryUsageHelper, EDataSeriesType, BaseDataSeries } from "scichart";
export type TObjectEntryOptions = {
    isWasmObject?: boolean;
    revocableToken?: ReturnType<ProxyConstructor["revocable"]>;
    proxy?: any;
};

export type TMetrics = Map<number, { count: number; capacity: number }>;
export type TDataSeriesInfo = { dataSeries: BaseDataSeries; metrics: TMetrics };

export class CustomObjectRegistry extends ObjectRegistry {
    public static stateCollection = new Map<number, string[]>();
    public static dataSeriesMap = new Map<string, TDataSeriesInfo>();
    public override add(obj: any, id: string, options: TObjectEntryOptions) {
        super.add(obj, id, options);

        const data = Array.from(this.undeletedObjectsMap, ([key]) => key);
        const time = performance.timeOrigin + performance.now();
        CustomObjectRegistry.stateCollection.set(time, data);
        setTimeout(() => {
            if (isDataSeries(obj)) {
                const dataSeries = obj;
                const metrics: TMetrics = new Map();
                CustomObjectRegistry.dataSeriesMap.set(id, { dataSeries, metrics });
                metrics.set(performance.timeOrigin + performance.now(), {
                    capacity: dataSeries.capacity,
                    count: dataSeries.count()
                });
                dataSeries.dataChanged.subscribe((args: IDataChangeArgs) => {
                    metrics.set(performance.timeOrigin + performance.now(), {
                        capacity: dataSeries.capacity,
                        count: dataSeries.count()
                    });
                });
            }
        });
    }

    public override remove(id: string) {
        const result = super.remove(id);

        const data = Array.from(this.undeletedObjectsMap, ([key]) => key);
        const time = performance.timeOrigin + performance.now();
        CustomObjectRegistry.stateCollection.set(time, data);

        // TODO this probably should be done from data series itself
        // CustomObjectRegistry.dataSeriesMap.get(id)?.dataSeries.dataChanged.unsubscribeAll();
        // CustomObjectRegistry.dataSeriesMap.delete(id);

        return result;
    }
}

export const subscribeToMemoryStats = () => {
    MemoryUsageHelper.objectRegistry = new CustomObjectRegistry();
    // if (!!window.SharedWorker) {
    //     const sharedWorker = new SharedWorker(new URL('./sharedWorker.ts', import.meta.url));
    //     sharedWorker.port.addEventListener('message', (e: MessageEvent<TSharedWorkerMessageArgs>) => {
    //         switch (e.data.type) {
    //             case EDebugInfoCollectionEvent.CollectFromThread: {
    //                 const args = {};
    //                 sharedWorker.port.postMessage({ type: EDebugInfoCollectionEvent.DebugInfoResponse, args });
    //                 break;
    //             }
    //         }
    //     });

    //     sharedWorker.port.start();
    // } else {
    //     console.error('No SharedWorker support!');
    // }
};

function isDataSeries(obj: any): obj is BaseDataSeries {
    if (obj && obj["type"]) {
        const type = obj.type as EDataSeriesType;
        return Object.keys(EDataSeriesType).includes(type);
    }
    return false;
}
