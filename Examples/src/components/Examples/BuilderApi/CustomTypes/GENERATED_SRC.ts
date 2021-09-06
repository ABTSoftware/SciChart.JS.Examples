export const code = `import * as React from "react";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import classes from "../../../Examples/Examples.module.scss";
import { ESeriesType } from "scichart/types/SeriesType";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelProviderType } from "scichart/types/LabelProviderType";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { EAnimationType } from "scichart/types/AnimationType";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EPaletteProviderType } from "scichart/types/PaletteProviderType";
import { EFillPaletteMode, EStrokePaletteMode, IFillPaletteProvider, IStrokePaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { EBaseType } from "scichart/types/BaseType";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { NumberRange } from "scichart/Core/NumberRange";

const divElementId = "chart";

// Define a custom PaletteProvider
export class ExampleMountainPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly palettedStroke = parseColorToUIntArgb("lime");
    private readonly palettedFill = parseColorToUIntArgb("yellow");

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
        return { type: EPaletteProviderType.Custom, customType: "ExampleMountain" };
    }
}

// Register it for use by the builder api
chartBuilder.registerType(EBaseType.PaletteProvider, "ExampleMountain", () => new ExampleMountainPaletteProvider());

const drawExample = async () => {
    // Build the surface
    const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(divElementId, {
                yAxes: { type: EAxisType.NumericAxis, 
                         options: { axisAlignment: EAxisAlignment.Left, visibleRange: new NumberRange(0, 1) } }
            });
    // Build the series.  
    // By doing this separately we can easily get the reference to the series so we can add generated data to it
    const [mountainSeries] = chartBuilder.buildSeries(wasmContext, {
        type: ESeriesType.MountainSeries,
        options: {
            paletteProvider: { type: EPaletteProviderType.Custom, customType: "ExampleMountain" },
            fillLinearGradient: {
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 0, y: 1 },
                gradientStops: [
                    { color: "rgba(70,130,180,1)", offset: 0 },
                    { color: "rgba(70,130,180,0.2)", offset: 1 }
                ]
            },
            drawNaNAs: ELineDrawMode.PolyLine,
            animation: { type: EAnimationType.Scale, options: { ease: "cubic" } }
        },
        xyData: {}
    });

    // Generate data
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        let y = Math.abs(Math.sin(i * STEP));
        if (y < 0.2) {
            y = NaN;
        }
        // We have to cast the dataSeries to the correct type in order to append to it.
        (mountainSeries.dataSeries as XyDataSeries).append(i, y);
    }
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

    return (
        <>
            <div className={classes.ChartWrapper}>
                <div id={divElementId} />
            </div>
        </>
    );
}


`;