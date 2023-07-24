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
import { createChart } from './chart-configurations';

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

interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    sciChartSurface: TSurface;
}

export type TInitFunction<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> = (
    rootElementId: string | HTMLDivElement
) => Promise<TInitResult>;

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface IChartComponentPropsCore<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>
    extends TDivProps {
    apiProvider?: (initResult: MutableRefObject<TInitResult>) => any;
    fallback?: React.ReactNode;
}

type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

type TChartComponentPropsWithConfig = IChartComponentPropsCore<
    SciChartSurface | SciChartPieSurface,
    IInitResult<SciChartSurface | SciChartPieSurface>
> & {
    initChart?: never;
    config: string | TSurfaceDefinition;
};

type TChartComponentProps<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> =
    | TChartComponentPropsWithInit<TSurface, TInitResult>
    | TChartComponentPropsWithConfig;

type TChartComponentPropsIntersection<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> & TChartComponentPropsWithConfig;

export class SciChartComponentAPI<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>> {
    protected initResultRef: MutableRefObject<TInitResult>;

    constructor(initResultRef: MutableRefObject<TInitResult>) {
        this.initResultRef = initResultRef;
    }

    public get sciChartSurface(): TSurface {
        return this.initResultRef.current.sciChartSurface;
    }

    public get customChartProperties(): TInitResult {
        return this.initResultRef.current;
    }
}

const createChartRoot = () => {
    const internalRootElement = document.createElement('div') as HTMLDivElement;
    // generate or provide a unique root element id to avoid chart rendering collisions
    internalRootElement.id = `chart-root-${generateGuid()}`;
    return internalRootElement;
};

function createChartFromConfig<TSurface extends ISciChartSurfaceBase>(config: string | TSurfaceDefinition) {
    return async (chartRoot: string | HTMLDivElement): Promise<IInitResult<SciChartSurface | SciChartPieSurface>> => {
        const chart = await chartBuilder.buildChart(chartRoot, config);
        if ('sciChartSurface' in chart) {
            // 2D Chart
            return { sciChartSurface: chart.sciChartSurface };
        } else {
            // Pie Chart
            return { sciChartSurface: chart };
        }
    };
}

// ForwardRefRenderFunction<any, IChartComponentProps<T>>
function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(props: TChartComponentProps<TSurface, TInitResult>, ref: ForwardedRef<any>) {
    console.log('SciChart');

    const { initChart, config, apiProvider, fallback, ...divElementProps } = props as TChartComponentPropsIntersection<
        TSurface,
        TInitResult
    >;

    if ((!initChart && !config) || (initChart && config)) {
        throw new Error(`Only one of "initChart" or "config" props is required!`);
    }

    const [divElementId] = useState(divElementProps.id ?? `component-root-${generateGuid()}`);

    const isMountedRef = useIsMountedRef();

    const initResultRef = useRef<TInitResult>();
    const sciChartSurfaceRef = useRef<TSurface>();

    const [isInitialized, setIsInitialized] = useState(false);
    const [chartRoot] = useState(createChartRoot);

    useEffect(() => {
        const initializationFunction = initChart
            ? (initChart as TInitFunction<TSurface, TInitResult>)
            : createChartFromConfig<TSurface>(config);
        const initPromise = initializationFunction(chartRoot).then((initResult) => {
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

        const performCleanup = () => {
            sciChartSurfaceRef.current.delete();
            sciChartSurfaceRef.current = undefined;
            initResultRef.current = undefined;
        };

        return () => {
            // check if chart is already initialized or wait init to finish before deleting it
            sciChartSurfaceRef.current ? performCleanup() : initPromise.then(performCleanup);
        };
    }, []);

    useEffect(() => {
        if (isInitialized && isMountedRef.current) {
            const rootElement = document.getElementById(divElementId);
            rootElement.appendChild(chartRoot);
        }
    }, [isInitialized]);

    // Expose Chart API
    useImperativeHandle(
        ref,
        () => (apiProvider ? apiProvider(initResultRef) : new SciChartComponentAPI(initResultRef)),
        [apiProvider]
    );

    return isInitialized ? <div {...divElementProps} id={divElementId} /> : fallback;
}

type TSciChartComponentProps = Parameters<typeof SciChartComponent>[0];
const SciChart = forwardRef<any, TSciChartComponentProps>(SciChartComponent);

export default SciChart;
