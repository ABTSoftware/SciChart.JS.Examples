import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";
import {
    EAutoRange,
    EAnnotationLayer,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    EVerticalAnchorPoint,
    FastLineRenderableSeries,
    formatNumber,
    HitTestInfo,
    NumericAxis,
    NumberRange,
    RolloverModifier,
    SciChartSurface,
    SeriesInfo,
    TextAnnotation,
    XyDataSeries,
    XyScaleOffsetFilter,
    XySeriesInfo,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";

export const divElementId = "chart";

const getScaleValue = (dataSeries: XyDataSeries, zeroXValue: number) => {
    const dataLength = dataSeries.count();
    let zeroIndex = -1;
    for (let i = 0; i < dataLength; i++) {
        const xValue = dataSeries.getNativeXValues().get(i);
        if (xValue >= zeroXValue) {
            zeroIndex = i;
            break;
        }
    }
    if (zeroIndex === -1) {
        return 1;
    }
    return 100 / dataSeries.getNativeYValues().get(zeroIndex);
};

class TransformedSeries extends FastLineRenderableSeries {
    public originalSeries: XyDataSeries;

    public getSeriesInfo(hitTestInfo: HitTestInfo): SeriesInfo {
        const info = new XySeriesInfo(this, hitTestInfo);
        // Use y value from original series
        if (this.originalSeries && info.dataSeriesIndex) {
            info.yValue = this.originalSeries.getNativeYValues().get(info.dataSeriesIndex);
        }
        return info;
    }
}

export const drawExample = async (usePercentage: boolean) => {
    // Create the SciChartSurface with Theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an X and Y Axis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        labelPostfix: usePercentage ? "%" : "",
        labelPrecision: usePercentage ? 0 : 1,
        growBy: new NumberRange(0.1, 0.1)
    });
    // Override the formatting of the cursor label as we don't want it to show the % postfix, since we're showing original data
    yAxis.labelProvider.formatCursorLabel = (value: number) => formatNumber(value, ENumericFormat.Decimal, 1);
    sciChartSurface.yAxes.add(yAxis);

    // Create a TransformedSeries which handles percentage changed. See above for definition.
    const lineSeries = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Generate some data to plot
    const data0 = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(100);
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues });

    // Offset the data by -100
    const transform1 = new XyScaleOffsetFilter(dataSeries1, { offset: -100 });

    // Update the scale of the data when the chart xAxis range changes
    xAxis.visibleRangeChanged.subscribe(args => (transform1.scale = getScaleValue(dataSeries1, args.visibleRange.min)));

    // When use percentage changed mode, we use the transformed series above
    if (usePercentage) {
        lineSeries.dataSeries = transform1;
        lineSeries.originalSeries = dataSeries1;
        // Else we use the original data
    } else {
        lineSeries.dataSeries = dataSeries1;
    }

    // Repeat for the second series
    const lineSeries2 = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividOrange
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    // Generate data and create transform
    const data1 = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(100);
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues });

    const transform2 = new XyScaleOffsetFilter(dataSeries2, { offset: -100 });
    xAxis.visibleRangeChanged.subscribe(args => (transform2.scale = getScaleValue(dataSeries2, args.visibleRange.min)));

    // Choose which dataseries to use when percentage mode is enabled
    if (usePercentage) {
        lineSeries2.dataSeries = transform2;
        lineSeries2.originalSeries = dataSeries2;
    } else {
        lineSeries2.dataSeries = dataSeries2;
    }

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: appTheme.VividTeal }));

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Toggle between original data & Percentage Changed on chart",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    // Add a watermark annotation
    const watermarkText = usePercentage ? "Percentage Changed" : "Original Data";
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: watermarkText,
            fontSize: 32,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0.5,
            opacity: 0.23,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart
        })
    );

    return { sciChartSurface, wasmContext };
};

const useStyles = makeStyles(theme => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%"
    },
    chartArea: {
        flex: 1
    }
}));

export default function PercentageChange() {
    const [usePercentage, setUsePercentage] = React.useState(true);
    const [scs, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample(usePercentage);
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            scs?.delete();
        };
    }, [usePercentage]);

    const handleUsePercentage = () => {
        const newValue = !usePercentage;
        setUsePercentage(newValue);
    };

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <ToggleButtonGroup
                    className={localClasses.toolbarRow}
                    exclusive
                    value={usePercentage}
                    onChange={handleUsePercentage}
                    size="small"
                    color="primary"
                    aria-label="small outlined button group"
                >
                    <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                        Percentage Change
                    </ToggleButton>
                    <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                        Original Data
                    </ToggleButton>
                </ToggleButtonGroup>
                <div id={divElementId} className={localClasses.chartArea} />
            </div>
        </div>
    );
}
