import * as React from "react";
import {
    SciChartSurface,
    chartBuilder,
    ESeriesType,
    EAxisType,
    ELineDrawMode,
    XyDataSeries,
    EAnimationType,
    EAxisAlignment,
    EPaletteProviderType,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IRenderableSeries,
    EBaseType,
    parseColorToUIntArgb,
    NumberRange,
    EAnnotationType,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
} from "scichart";
import { appTheme } from "scichart-example-dependencies";
import classes from "../../styles/Examples.module.scss";

const divElementId = "chart";

// Define a custom PaletteProvider
export class ExampleMountainPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public static Name: "ExampleMountain";
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly palettedStroke: number;
    private readonly palettedFill: number;
    private readonly options: { stroke: string; fill: string };

    constructor(options: { stroke: string; fill: string }) {
        this.options = options;
        this.palettedStroke = parseColorToUIntArgb(options.stroke);
        this.palettedFill = parseColorToUIntArgb(options.fill);
    }

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        if (yValue > 0.5 && yValue < 0.75) {
            return this.palettedFill;
        } else {
            return undefined;
        }
    }

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        if (yValue > 0.5 && yValue < 0.75) {
            return this.palettedStroke;
        } else {
            return undefined;
        }
    }

    // Add a toJSON method so this can be serialized.
    // @ts-ignore
    public toJSON() {
        return {
            type: EPaletteProviderType.Custom,
            customType: ExampleMountainPaletteProvider.Name,
            options: this.options
        };
    }
}

// Register it for use by the builder api
chartBuilder.registerType(
    EBaseType.PaletteProvider,
    ExampleMountainPaletteProvider.Name,
    (options: { stroke: string; fill: string }) => new ExampleMountainPaletteProvider(options)
);

const drawExample = async () => {
    // Build the surface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: appTheme.SciChartJsTheme },
        yAxes: {
            type: EAxisType.NumericAxis,
            options: { axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 1) }
        },
        // Add annotations
        annotations: [
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Builder API Demo",
                    x1: 0.5,
                    y1: 0.5,
                    opacity: 0.33,
                    yCoordShift: -26,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 42,
                    fontWeight: "Bold"
                }
            },
            {
                type: EAnnotationType.SVGTextAnnotation,
                options: {
                    text: "Create SciChart charts with JSON Objects",
                    x1: 0.5,
                    y1: 0.5,
                    yCoordShift: 26,
                    opacity: 0.33,
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.Relative,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    fontSize: 36,
                    fontWeight: "Bold"
                }
            }
        ]
    });
    // Build the series.
    // By doing this separately we can easily get the reference to the series so we can add generated data to it
    const [mountainSeries] = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.MountainSeries,
        options: {
            paletteProvider: {
                type: EPaletteProviderType.Custom,
                customType: ExampleMountainPaletteProvider.Name,
                options: { stroke: appTheme.MutedRed, fill: appTheme.VividOrange }
            },
            fillLinearGradient: {
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 0, y: 1 },
                gradientStops: [
                    { color: appTheme.VividBlue, offset: 0 },
                    { color: "Transparent", offset: 1 }
                ]
            },
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 3,
            drawNaNAs: ELineDrawMode.PolyLine,
            animation: { type: EAnimationType.Scale, options: { ease: "cubic" } }
        }
    });

    // Create a dataSeries the normal way
    const dataSeries = new XyDataSeries(wasmContext);
    // Generate data
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        let y = Math.abs(Math.sin(i * STEP));
        if (y < 0.2) {
            y = NaN;
        }
        dataSeries.append(i, y);
    }
    mountainSeries.dataSeries = dataSeries;
    // Since we built the series separately, we have to manually add it to the surface
    sciChartSurface.renderableSeries.add(mountainSeries);

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BuilderCustomTypes() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
