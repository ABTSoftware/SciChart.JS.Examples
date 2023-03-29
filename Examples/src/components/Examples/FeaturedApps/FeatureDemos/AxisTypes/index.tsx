import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import classes from "../../../Examples.module.scss";
import { TBinanceCandleData } from "../../../../../commonTypes/TBinanceCandleData";
import {appTheme} from "../../../theme";
import {makeStyles} from "@material-ui/core/styles";

import {
    CategoryAxis,
    DateTimeNumericAxis,
    EFillPaletteMode,
    EStrokePaletteMode,
    EAutoRange,
    EAxisAlignment,
    ELabelAlignment,
    ENumericFormat,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    parseColorToUIntArgb,
    SciChartSurface,
    TextLabelProvider,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";

const divElementId = "chart";

const colorStrings = [appTheme.VividSkyBlue, appTheme.VividPink, appTheme.MutedTeal, appTheme.VividOrange, appTheme.VividBlue];
const colors = colorStrings.map(c => parseColorToUIntArgb(c + "AA"));

const drawExample = async () => {
    // Create a SciChartSurface with Theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Category Axis - measures using index not value.
    const xAxis = new CategoryAxis(wasmContext, { id: "XCategory" });
    const labelProvider = new TextLabelProvider({
        labels: ["Bitcoin", "Ethereum", "XRP", "Cardano", "Dogecoin"]
    });
    xAxis.labelProvider = labelProvider;
    xAxis.labelStyle.fontSize = 18;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;
    xAxis.labelStyle.padding = new Thickness(2, 1, 2, 1);
    // Allow rotated labels to overlap
    xAxis.axisRenderer.hideOverlappingLabels = false;
    // Keep first and last labels aligned to their ticks
    xAxis.axisRenderer.keepLabelsWithinAxis = false;
    xAxis.axisTitle = ["Top 5 Coins - Category Axis", "Custom labels using TextLabelProvider"];
    xAxis.axisTitleStyle.fontSize = 18;

    sciChartSurface.xAxes.add(xAxis);

    // Numeric Y-Axis. measures using value
    const yAxis = new NumericAxis(wasmContext, {
        id: "YNumeric",
        autoRange: EAutoRange.Always,
        labelPrefix: "$",
        labelPostfix: "B",
        labelPrecision: 0,
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { fontSize: 18 }
    });
    // Pass array to axisTitle to make it multiline
    yAxis.axisTitle = ["Market Cap - Numeric Axis", "formatting using prefix and postfix"];
    yAxis.axisTitleStyle.fontSize = 18;

    sciChartSurface.yAxes.add(yAxis);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        strokeThickness: 0,
        dataPointWidth: 0.5,
        paletteProvider: new AxisTypesPaletteProvider(),
        xAxisId: xAxis.id,
        yAxisId: yAxis.id
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([0, 1, 2, 3, 4], [380.9, 162.1, 23.87, 14.56, 8.372]);
    columnSeries.dataSeries = dataSeries;
    const endDate = new Date(2022, 10, 5);
    const startTime = endDate.getTime() / 1000 - 500 * 7 * 24 * 60 * 60;
    const dateXAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        id: "XDate",
        labelStyle: { fontSize: 18 },
        axisTitle: ["Date Axis", "Auto formats based on the date range"],
        axisTitleStyle: { fontSize: 18 },
        visibleRangeLimit: new NumberRange(startTime, endDate.getTime() / 1000)
    });
    sciChartSurface.xAxes.add(dateXAxis);

    // Logarithmic Y Axis - measures on log scale using value
    const logYAxis = new LogarithmicAxis(wasmContext, {
        id: "YLog",
        logBase: 2,
        labelFormat: ENumericFormat.SignificantFigures,
        labelPrefix: "$",
        axisAlignment: EAxisAlignment.Right,
        labelStyle: { fontSize: 18 },
        axisTitle: ["Price - Logarithmic Axis", "base 2, labelFormat: SignificantFigures"],
        axisTitleStyle: { fontSize: 18 }
    });
    sciChartSurface.yAxes.add(logYAxis);

    const symbols = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"];
    for (let index = 0; index < symbols.length; index++) {
        const symbol = symbols[index];
        const priceDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: symbol });
        const series = new FastLineRenderableSeries(wasmContext, {
            id: symbol,
            strokeThickness: 3,
            xAxisId: dateXAxis.id,
            yAxisId: logYAxis.id,
            stroke: colorStrings[index],
            dataSeries: priceDataSeries
        });
        sciChartSurface.renderableSeries.add(series);

        (async () => {
            const response = await fetch(
                `/api/get-binance-candles?interval=1w&symbol=${symbol}&limit=500&endTime=${endDate}`
            );
            const data: TBinanceCandleData = await response.json();
            priceDataSeries.appendRange(data.xValues, data.closeValues);
            sciChartSurface.zoomExtents();
        })();
    }

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ includedXAxisIds: [dateXAxis.id], includedYAxisIds: [logYAxis.id] }),
        new MouseWheelZoomModifier({ includedXAxisIds: [dateXAxis.id], includedYAxisIds: [logYAxis.id] }),
        new ZoomExtentsModifier()
    );
    return { sciChartSurface, wasmContext, labelProvider };
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
        width: "100%",
        color: appTheme.ForegroundColor
    },
    chartArea: {
        flex: 1,
    }
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function FeatureAxisTypes() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [labelProvider, setLabelProvider] = React.useState<TextLabelProvider>();
    const [preset, setPreset] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setLabelProvider(res.labelProvider);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handlePreset = (event: any, value: number) => {
        setPreset(value);
        switch (value) {
            case 0:
                labelProvider.rotation = 0;
                labelProvider.maxLength = 9;
                break;
            case 1:
                labelProvider.rotation = 20;
                labelProvider.maxLength = 0;
                break;
            case 2:
                labelProvider.rotation = 30;
                labelProvider.maxLength = 12;
                break;
            default:
                labelProvider.rotation = 0;
                labelProvider.maxLength = 9;
                break;
        }
    };

    const localClasses = useStyles();

    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        exclusive
                        value={preset}
                        onChange={handlePreset}
                        size="medium"
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={0} style={{ color: appTheme.ForegroundColor }}>Multi-Line</ToggleButton>
                        <ToggleButton value={1} style={{ color: appTheme.ForegroundColor }}>Single Line Rotated</ToggleButton>
                        <ToggleButton value={2} style={{ color: appTheme.ForegroundColor }}>Multi-Line Rotated</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div className={localClasses.chartArea} id={divElementId}></div>
            </div>
        </div>
    );
}

class AxisTypesPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return colors[xValue];
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return undefined;
    }
}
