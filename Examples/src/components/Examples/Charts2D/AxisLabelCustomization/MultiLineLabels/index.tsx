import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import * as React from "react";
import {
    XyDataSeries,
    TextLabelProvider,
    NumericAxis,
    FastColumnRenderableSeries,
    SciChartSurface,
    Thickness,
    EAutoRange,
    ELabelAlignment,
    WaveAnimation,
    NumberRange,
    PaletteFactory,
    Point,
    GradientParams,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
import classes from "scichart-example-dependencies/styles/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {

    // Dataset = 'percentage market share of phones, 2022'
    const dataset = [
        { name: "Apple", percent: 28.41 },
        { name: "Samsung", percent: 28.21 },
        { name: "Xiaomi", percent: 12.73 },
        { name: "Huawei", percent: 5.27 },
        { name: "Oppo", percent: 5.53 },
        { name: "Vivo", percent: 4.31 },
        { name: "Realme", percent: 3.16 },
        { name: "Motorola", percent: 2.33 },
        { name: "Unknown", percent: 2.19 },
        { name: "LG", percent: 0.85 },
        { name: "OnePlus", percent: 1.11 },
        { name: "Tecno", percent: 1.09 },
        { name: "Infinix", percent: 0.96 },
        { name: "Google", percent: 0.77 },
        { name: "Nokia", percent: 0.45 },
    ];

    // Create the SciChartSurface with theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // Create the XAxis labelprovider (maps x-value to axis label)
    const labelProvider = new TextLabelProvider({
        labels: dataset.map(row => "Manufacturer " + row.name + " (2022)"),
        maxLength: 12
    });

    // Create an XAxis
    const xAxis = new NumericAxis(wasmContext, {
        // labelprovider maps Xaxis values (in this case index) to labels (in this case manufacturer name)
        labelProvider,
        labelStyle: {
            alignment: ELabelAlignment.Center,
            padding: new Thickness(2,1,2,1),
            fontSize: 11,
        },
        // Ensure there can be 1 label per item in the dataset.
        // Also see major/minor delta in the docs
        maxAutoTicks: 15,
        // add the title
        axisTitle: "Mobile phone manufacturer",
    });

    // additional axis options
    //

    // Prevent overlapping labels from drawing
    xAxis.axisRenderer.hideOverlappingLabels = false;
    // Keep first and last labels aligned to their ticks
    xAxis.axisRenderer.keepLabelsWithinAxis = false;

    sciChartSurface.xAxes.add(xAxis);

    // Create a Y-Axis with standard properties
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        axisTitle: "Market Share (%)",
        growBy: new NumberRange(0, 0.1),
        labelPostfix: " %"
    }));

    // Add a column series.
    sciChartSurface.renderableSeries.add(new FastColumnRenderableSeries(wasmContext, {
        // Name index to xvalue for category axis
        // Map percentage to yvalue
        // store the manufacturer name in the metadata (used to generate colors)
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: dataset.map((row, index) => index),
            yValues: dataset.map(row => row.percent),
        }),
        strokeThickness: 1,
        // Optional datalabels on series. To enable set a style and position
        dataLabels: {
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Above,
            style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(0,0,20,0) },
            color: appTheme.ForegroundColor,
        },
        // each column occupies 50% of available space
        dataPointWidth: 0.5,
        // add a corner radius. Why not!
        cornerRadius: 10,
        // add a gradient fill in X (why not?)
        paletteProvider: PaletteFactory.createGradient(wasmContext, new GradientParams(new Point(0,0), new Point(1,1), [
            {offset: 0, color: appTheme.VividPink },
            {offset: 0.2, color: appTheme.VividOrange},
            {offset: 0.3, color: appTheme.MutedRed},
            {offset: 0.5, color: appTheme.VividGreen},
            {offset: 0.7, color: appTheme.VividSkyBlue},
            {offset: 0.9, color: appTheme.Indigo},
            {offset: 1, color: appTheme.DarkIndigo},
        ]), { enableFill: true }),
        // Bit more eye candy ;)
        animation: new WaveAnimation({ duration: 1000 })
    }));

    // Add title annotation
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Multi-Line and Rotated Axis Labels in SciChart.js",
        fontSize: 16,
        textColor: appTheme.ForegroundColor,
        x1: 0.5,
        y1: 0,
        opacity: 0.77,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
    }));

    return { sciChartSurface, wasmContext, labelProvider };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function MultiLineLabels() {
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


    return (<div className={classes.ChartWrapper} style={{background: appTheme.DarkIndigo, }}>
                <div id={divElementId} style={{height: "calc(100% - 100px)", width: "100%"}}/>
                <ToggleButtonGroup
                    style={{height: "100px", padding: "10",}}
                    exclusive
                    value={preset}
                    onChange={handlePreset}
                    size="medium" color="primary" aria-label="small outlined button group">
                    <ToggleButton value={0} style={{color: appTheme.ForegroundColor}}>
                        Multi-Line
                    </ToggleButton>
                    <ToggleButton value={1} style={{color: appTheme.ForegroundColor}}>
                        Single Line Rotated
                    </ToggleButton>
                    <ToggleButton value={2} style={{color: appTheme.ForegroundColor}}>
                        Multi-Line Rotated
                    </ToggleButton>
                </ToggleButtonGroup>
        </div>
    );
}
