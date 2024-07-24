import { useContext, useEffect, useRef, useState } from "react";
import { appTheme } from "../../../theme";
import {
    AUTO_COLOR,
    DataPointSelectionModifier,
    EAutoRange,
    EAxisAlignment,
    EAxisType,
    EChart2DModifierType,
    ELabelProviderType,
    EModifierType,
    ESelectionMode,
    ESeriesType,
    EXyDirection,
    GradientParams,
    IPointMetadata,
    NumberRange,
    NumericLabelProvider,
    Point,
    SciChartSurface,
    TModifierKeys,
    TSurfaceDefinition,
    SelectionChangedArgs,
    DataPointSelectionChangedArgs,
} from "scichart";
import { TDataEntry } from "./data-generation";
import { TMainChartConfigFunc } from "./main-chart-config";
import { SciChartReact, SciChartSurfaceContext } from "scichart-react";

const SelectedDataPointModal = () => {
    // get reference to chart init result
    const context = useContext(SciChartSurfaceContext) as Awaited<ReturnType<TMainChartConfigFunc>>;
    const [seriesViewRect, setSeriesViewRect] = useState(context.sciChartSurface.seriesViewRect);
    const viewport = context.sciChartSurface.renderSurface.viewportSize;
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<{
        xValues: number[];
        yValues: number[];
        metadata: IPointMetadata[];
    }>({ xValues: [], yValues: [], metadata: [] });
    const dataPointSelectionModifierRef = useRef<DataPointSelectionModifier>(null);
    const handleClose = () => {
        // dataPointSelectionModifierRef.current.deselectAllPoints(true);
        setShowModal(false);
    };

    useEffect(() => {
        dataPointSelectionModifierRef.current = new DataPointSelectionModifier({
            allowDragSelect: false,
            getSelectionMode: (modifierKeys: TModifierKeys, isAreaSelection: boolean) => {
                return ESelectionMode.Replace;
            },
            onSelectionChanged: (args: DataPointSelectionChangedArgs) => {
                const [selectedPoint] = args.selectedDataPoints;
                const pointMetadata = selectedPoint?.metadata as {
                    isSelected: boolean;
                    entries: TDataEntry[];
                };

                if (!pointMetadata) {
                    return;
                }

                const sortedEntries = pointMetadata.entries.sort((a, b) => b.duration - a.duration);
                const xValues = sortedEntries.map((entry, index) => index);
                const yValues = sortedEntries.map((entry, index) => entry.duration);
                const metadata = sortedEntries.map((entry) => ({
                    isSelected: false,
                    entry,
                }));
                setData({
                    xValues,
                    yValues,
                    metadata,
                });
                setShowModal(true);
            },
        });
        context.sciChartSurface.chartModifiers.add(dataPointSelectionModifierRef.current);
    }, []);

    // // subscribe to seriesViewRectChange
    // useEffect(() => {
    //     if (!context) {
    //         return null;
    //     }

    //     let previousViewRect = seriesViewRect;
    //     const checkViewRectChange = () => {
    //         const currentSeriesViewRect = context.sciChartSurface.seriesViewRect;

    //         if (!previousViewRect || !Rect.isEqual(currentSeriesViewRect, previousViewRect)) {
    //             previousViewRect = currentSeriesViewRect;
    //             setSeriesViewRect(currentSeriesViewRect);
    //         }
    //     };
    //     context.sciChartSurface.rendered.subscribe(checkViewRectChange);

    //     return () => {
    //         context.sciChartSurface.rendered.unsubscribe(checkViewRectChange);
    //     };
    // }, [context]);

    // const [width, setWidth] = useState('1600');
    // const changeWidth: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    //     setWidth(event.target.value);
    //     context.updateThreshold(parseInt(event.target.value));
    // };

    // if (!seriesViewRect) {
    //     return null;
    // }

    const xAxisLabelProvider = new NumericLabelProvider();
    xAxisLabelProvider.formatLabel = (value: number) => {
        return `${data.yValues[value]}`;
    };

    const chartConfig: TSurfaceDefinition = {
        surface: {
            theme: appTheme.SciChartJsTheme,
            disableAspect: true,
        },
        xAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisAlignment: EAxisAlignment.Left,
                autoRange: EAutoRange.Never,
                visibleRange: new NumberRange(0, data.xValues.length / 10),
                visibleRangeLimit: new NumberRange(0, data.xValues.length - 1),
                // isVisible: false,
                minorsPerMajor: 0,
                autoTicks: false,
                majorDelta: 1,
                labelProvider: xAxisLabelProvider,
            },
        },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: {
                axisAlignment: EAxisAlignment.Top,
                autoRange: EAutoRange.Once,
                flippedCoordinates: true,
                growBy: new NumberRange(0, 0.5),
            },
        },
        series: {
            type: ESeriesType.ColumnSeries,
            xyData: data,
            options: {
                stroke: AUTO_COLOR,
                strokeThickness: 0,
                fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: appTheme.MutedRed, offset: 0 },
                    { color: appTheme.MutedTeal, offset: 1 },
                ]),
            },
        },
        modifiers: [
            {
                type: EChart2DModifierType.ZoomPan,
                options: {
                    xyDirection: EXyDirection.XDirection,
                },
            },
            {
                type: EChart2DModifierType.ZoomExtents,
                options: {
                    xyDirection: EXyDirection.XDirection,
                },
            },
            {
                type: EChart2DModifierType.MouseWheelZoom,
                options: {
                    xyDirection: EXyDirection.XDirection,
                },
            },
        ],
    };

    return (
        <div
            style={{
                top: "10em",
                left: "10em",
                width: "calc(100% - 20em)",
                height: "calc(100% - 20em)",
                position: "fixed",
                zIndex: 10,
                color: appTheme.ForegroundColor,
                pointerEvents: "none",
            }}
        >
            {showModal ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents: "all",
                        backgroundColor: appTheme.MutedSkyBlue,
                        padding: "1em",
                        boxSizing: "border-box",
                    }}
                >
                    <button
                        style={{
                            position: "absolute",
                            right: "1em",
                            zIndex: 1,
                        }}
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <SciChartReact<SciChartSurface>
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        config={chartConfig}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default SelectedDataPointModal;
