import {
    CSSProperties,
    ForwardRefRenderFunction,
    ForwardedRef,
    useRef,
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
    useLayoutEffect,
    DetailedHTMLProps,
    HTMLAttributes,
    MutableRefObject,
    useId,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
} from 'react';
import {
    ISciChartSurfaceBase,
    SciChart3DSurface,
    SciChartPieSurface,
    SciChartSurface,
    TSurfaceDefinition,
    chartBuilder,
    generateGuid,
} from 'scichart';
import { SurfaceContext } from './SurfaceContext';

const useIsMountedRef = () => {
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return isMountedRef;
};

const useIsStrictModeRef = () => {
    const wasMountedRef = useRef(false);
    const isStrictModeRef = useRef(undefined);

    useEffect(() => {
        if (wasMountedRef.current) {
            isStrictModeRef.current = true;
        }

        wasMountedRef.current = true;
    }, []);

    return isStrictModeRef;
};

export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    sciChartSurface: TSurface;
}

export type TInitFunction<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> = (
    rootElementId: string | HTMLDivElement
) => Promise<TInitResult>;

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> extends TDivProps {
    // apiProvider?: (initResult: MutableRefObject<TInitResult>) => any;
    fallback?: React.ReactNode;
    onInit?: (initResult?: TInitResult) => void;
    innerContainerProps?: TDivProps;
}

export type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

type TChartComponentPropsWithConfig<TSurface extends ISciChartSurfaceBase> = IChartComponentPropsCore<
    TSurface,
    IInitResult<TSurface>
> & {
    initChart?: never;
    config: string | TSurfaceDefinition;
};

type TChartComponentProps<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> =
    | TChartComponentPropsWithInit<TSurface, TInitResult>
    | TChartComponentPropsWithConfig<TSurface>;

type TChartComponentPropsIntersection<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> & TChartComponentPropsWithConfig<TSurface>;

export abstract class SciChartComponentAPIBase<
    TInitResult extends IInitResult<TSurface>,
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase
> {
    protected initResult: TInitResult;

    constructor(initResult: TInitResult) {
        this.initResult = initResult;
    }
}

export class DefaultSciChartComponentAPI<
    TInitResult extends IInitResult<TSurface>,
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase
> extends SciChartComponentAPIBase<TInitResult, TSurface> {
    public get sciChartSurface(): TSurface {
        return this.initResult.sciChartSurface;
    }

    public get customChartProperties(): TInitResult {
        return this.initResult;
    }
}

const createNode = (ref: MutableRefObject<any>) => {
    return <div id={`chart-root-${generateGuid()}`} style={{ width: '100%', height: '100%' }} ref={ref}></div>;
};

const createChartRoot = () => {
    // check if SSR
    if (typeof window === 'undefined') {
        return null;
    }

    const internalRootElement = document.createElement('div') as HTMLDivElement;
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    internalRootElement.style.width = '100%';
    internalRootElement.style.height = '100%';
    return internalRootElement;
};

function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(config: string | TSurfaceDefinition) {
    return async (chartRoot: string | HTMLDivElement): Promise<IInitResult<TSurface>> => {
        // Potentially should return 2D, 3D, or Pie Chart
        const chart = (await chartBuilder.buildChart(chartRoot, config)) as any;
        if ('sciChartSurface' in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface as TSurface };
        } else if ('sciChart3DSurface' in chart) {
            // 3D Chart
            return { sciChartSurface: chart.sciChart3DSurface as TSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart as TSurface };
        }
    };
}

// ForwardRefRenderFunction<any, IChartComponentProps<T>>
function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(
    props: TChartComponentProps<TSurface, TInitResult>
    // , ref: ForwardedRef<any>
) {
    const {
        initChart,
        config,
        // apiProvider, //
        fallback,
        onInit,
        innerContainerProps,
        ...divElementProps
    } = props as TChartComponentPropsIntersection<TSurface, TInitResult>;

    if ((!initChart && !config) || (initChart && config)) {
        throw new Error(`Only one of "initChart" or "config" props is required!`);
    }

    const [divElementId] = useState(divElementProps.id ?? `component-root-${useId()}`);

    const isMountedRef = useIsMountedRef();

    const initPromiseRef = useRef<Promise<TInitResult | IInitResult<TSurface>>>();
    const initResultRef = useRef<TInitResult>();
    const sciChartSurfaceRef = useRef<TSurface>();

    const [isInitialized, setIsInitialized] = useState(false);
    const [chartRoot] = useState(createChartRoot);

    useEffect(() => {
        const initializationFunction = initChart
            ? (initChart as TInitFunction<TSurface, TInitResult>)
            : createChartFromConfig<TSurface>(config);

        const runInit = async () => {
            return initializationFunction(chartRoot).then((initResult) => {
                if (!initResult.sciChartSurface) {
                    throw new Error(
                        `"initChart" function should resolve to an object with "sciChartSurface" property ({ sciChartSurface })`
                    );
                }
                // TODO try to remove assertions after 3D charts could be created via Builder API
                sciChartSurfaceRef.current = initResult.sciChartSurface as TSurface;
                initResultRef.current = initResult as TInitResult;

                setIsInitialized(true);

                return initResult;
            });
        };

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = () => {
            console.log('performCleanup', divElementId);

            sciChartSurfaceRef.current.delete();
            sciChartSurfaceRef.current = undefined;
            initResultRef.current = undefined;
        };

        return () => {
            console.log('unmount SciChart', divElementId);
            // check if chart is already initialized or wait init to finish before deleting it
            sciChartSurfaceRef.current ? performCleanup() : initPromise.then(performCleanup);
        };
    }, []);

    useEffect(() => {
        if (isInitialized && isMountedRef.current) {
            const rootElement = document.getElementById(divElementId);
            rootElement.appendChild(chartRoot);

            if (onInit) {
                onInit(initResultRef.current);
            }
        }
    }, [isInitialized]);

    // Expose Chart API
    // useImperativeHandle(
    //     ref,
    //     () => (apiProvider ? apiProvider(initResultRef) : new DefaultSciChartComponentAPI(initResultRef)),
    //     [apiProvider]
    // );
    // return <div {...divElementProps} id={divElementId}></div>
    return isInitialized ? (
        <SurfaceContext.Provider value={sciChartSurfaceRef.current}>
            <div {...divElementProps}>
                <div {...innerContainerProps} id={divElementId}></div>
                {props.children}
            </div>
        </SurfaceContext.Provider>
    ) : (
        fallback
    );
}

type TSciChartComponent = <
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(
    props: TChartComponentProps<TSurface, TInitResult> & {
        ref?: ForwardedRef<SciChartComponentAPIBase<TInitResult, TSurface>>;
    }
    // ref?: ForwardedRef<any>
) => ReturnType<typeof SciChartComponent>;

// // Redecalare forwardRef
// declare module "react" {
//     function forwardRef<T, P = {}>(
//       render: (props: P, ref: Ref<T>) => ReactNode | null
//     ): (props: P & RefAttributes<T>) => ReactNode | null;
//   }

// const SciChart = forwardRef(SciChartComponent) as ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
const SciChart = SciChartComponent;
export default SciChart;

// const SomeComp = () => {
//     // const surfaceRef = useRef<any>()
//     // const surfaceRef = useRef<TInitFuncResultType>(null);
//     const chartRef = useRef<Awaited<ReturnType<typeof initChartFunction>>>(null);
//     const chart3DRef = useRef<Awaited<ReturnType<typeof init3D>>>(null);

//     const onInit = (initResult: Awaited<ReturnType<typeof initChartFunction>>) => {
//         chartRef.current = initResult;
//         initResult.sciChartSurface;
//         initResult.customProp;
//     };

//     const onInit3D = (initResult: Awaited<ReturnType<typeof init3D>>) => {
//         chart3DRef.current = initResult;
//         initResult.sciChartSurface;
//         initResult.customProp;
//     };

//     return (
//         <>
//             <SciChart<SciChartSurface, TInitFuncResultType> initChart={initChartFunction} onInit={onInit}>
//                 <SciChart/>
//             <SciChart style={{}} initChart={init3D} onInit={onInit3D} />
//         </>
//     );
// };

type TInitFuncResultType = { sciChartSurface: SciChartSurface; customProp: {} };
const initChartFunction = async (divElementId: string | HTMLDivElement): Promise<TInitFuncResultType> => {
    const { sciChartSurface } = await SciChartSurface.create(divElementId);

    return { sciChartSurface, customProp: {} };
};

const init3D = async (divElementId: string | HTMLDivElement) => {
    const { sciChart3DSurface } = await SciChart3DSurface.create(divElementId);

    return { sciChartSurface: sciChart3DSurface, customProp: {} };
};
