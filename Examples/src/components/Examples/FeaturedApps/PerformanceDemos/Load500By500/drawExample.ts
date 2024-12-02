import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EAutoRange,
    TextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    EAnnotationLayer,
    XyDataSeries,
    FastLineRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    EAxisAlignment,
} from "scichart";
import { appTheme } from "../../../theme";

export type TTimeSpan = {
    title: string;
    durationMs: number;
};

const SERIES = 500;
const POINTS = 500;

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void,
    useVerticalChart = false
) => {
    // Create the SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an X,Y Axis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: false,
            axisAlignment: useVerticalChart ? EAxisAlignment.Left : EAxisAlignment.Bottom,
            flippedCoordinates: true,
            visibleRange: new NumberRange(0, POINTS),
            autoRange: EAutoRange.Never,
            axisTitle: "X Axis",
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: false,
            axisAlignment: useVerticalChart ? EAxisAlignment.Bottom : EAxisAlignment.Left,
            visibleRange: new NumberRange(-250, 250),
            autoRange: EAutoRange.Never,
            axisTitle: "Y Axis",
        })
    );

    if (!useVerticalChart) {
        const watermarkAnnotation = (text: string, offset: number = 0) => {
            return new TextAnnotation({
                text,
                fontSize: 42,
                fontWeight: "Bold",
                textColor: appTheme.ForegroundColor,
                x1: 0.5,
                y1: 0.5,
                yCoordShift: offset,
                opacity: 0.43,
                horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                verticalAnchorPoint: EVerticalAnchorPoint.Center,
                xCoordinateMode: ECoordinateMode.Relative,
                yCoordinateMode: ECoordinateMode.Relative,
                annotationLayer: EAnnotationLayer.AboveChart,
            });
        };
        // add a title annotation
        sciChartSurface.annotations.add(watermarkAnnotation("SciChart.js Performance Demo", -52));
        sciChartSurface.annotations.add(watermarkAnnotation(`${SERIES} Series x ${POINTS} Points per series`, 0));
        sciChartSurface.annotations.add(watermarkAnnotation(`(${(SERIES * POINTS) / 1000}k DataPoints)`, 52));
    }

    // // add a title annotation
    // // Add title annotation
    // sciChartSurface.annotations.add(new TextAnnotation({
    //     text: "SciChart.js Performance Demo: Draw 500 Series x 500 Points (250k Points total)",
    //     fontSize: 16,
    //     textColor: appTheme.ForegroundColor,
    //     x1: 1,
    //     y1: 0,
    //     xCoordShift: -20,
    //     opacity: 0.77,
    //     horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
    //     xCoordinateMode: ECoordinateMode.Relative,
    //     yCoordinateMode: ECoordinateMode.Relative,
    // }));

    // We pre-create N empty FastLineRenderableSeries for the performance test. Going to fill these with data below
    const dataSeriesArray: XyDataSeries[] = new Array<XyDataSeries>(SERIES);
    const rendSeriesArray: FastLineRenderableSeries[] = new Array<FastLineRenderableSeries>(SERIES);
    for (let i = 0; i < SERIES; i++) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext);
        const rendSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 2,
            stroke: "auto",
        });

        dataSeriesArray[i] = dataSeries;
        rendSeriesArray[i] = rendSeries;

        sciChartSurface.renderableSeries.add(rendSeries);
    }

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Buttons for chart
    const loadPoints = () => {
        const newTimeSpans: TTimeSpan[] = [];

        // Start counting Points generation time
        const generateTimestamp = Date.now();

        const xValuesArray: number[][] = new Array<number[]>(SERIES);
        const yValuesArray: number[][] = new Array<number[]>(SERIES);
        for (let i = 0; i < SERIES; i++) {
            // Allocate data arrays
            xValuesArray[i] = new Array<number>(POINTS);
            yValuesArray[i] = new Array<number>(POINTS);

            // Clear data, if any
            dataSeriesArray[i].clear();

            // Generate points
            let prevYValue = 0;
            for (let j = 0; j < POINTS; j++) {
                const curYValue = Math.random() * 10 - 5;

                xValuesArray[i][j] = j;
                yValuesArray[i][j] = prevYValue + curYValue;

                prevYValue += curYValue;
            }
        }

        // Add the first time span: Generating 500 series x 500 points
        newTimeSpans.push({
            title: "Generate Data Points",
            durationMs: Date.now() - generateTimestamp,
        });

        // Start counting batch append time
        const appendTimestamp = Date.now();
        for (let i = 0; i < SERIES; i++) {
            dataSeriesArray[i].appendRange(xValuesArray[i], yValuesArray[i]);
        }

        // Add the second time span: Generation of data point
        newTimeSpans.push({
            title: "Append Data Points",
            durationMs: Date.now() - appendTimestamp,
        });

        // Subscribe to sciChartSurface.rendered event,
        // and calculate time duration between the append and
        // the first frame after it
        const firstFrameTimestamp = Date.now();
        let frameIndex: number = 0;
        let nextFramesTimestamp: number;
        const handler = () => {
            if (frameIndex === 0) {
                // Add the third time span: Render the first frame
                newTimeSpans.push({
                    title: "Render the frame",
                    durationMs: Date.now() - firstFrameTimestamp,
                });
                nextFramesTimestamp = Date.now();
            } else {
                // Unsubscribe from sciChartSurface.rendered
                updateTimeSpans(newTimeSpans);
                sciChartSurface.rendered.unsubscribe(handler);

                // Zoom extents at the end of performance measurement
                // sciChartSurface.zoomExtents();
            }
            setTimeout(sciChartSurface.invalidateElement, 0);
            // Increment frame index
            frameIndex++;
        };
        sciChartSurface.rendered.subscribe(handler);
    };

    let timerId: NodeJS.Timeout;
    const startUpdate = () => {
        timerId = setInterval(loadPoints, 200);
    };

    const stopUpdate = () => {
        clearInterval(timerId);
    };

    const reloadOnce = () => {
        loadPoints();
    };

    return { wasmContext, sciChartSurface, controls: { startUpdate, stopUpdate, reloadOnce } };
};
