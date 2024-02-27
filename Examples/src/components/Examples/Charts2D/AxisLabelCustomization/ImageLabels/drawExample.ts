import {
    XyDataSeries,
    TTextStyle,
    NumericAxis,
    FastColumnRenderableSeries,
    SciChartSurface,
    TextureManager,
    EAutoRange,
    ENumericFormat,
    createImagesArrayAsync,
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    parseColorToUIntArgb,
    IRenderableSeries,
    IPointMetadata,
    PaletteFactory,
    GradientParams,
    Point,
    WaveAnimation,
    NumberRange,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
} from "scichart";

import appleLogo from "./images/apple.png";
import samsungLogo from "./images/samsung.png";
import xiaomiLogo from "./images/xiaomi.png";
import huaweiLogo from "./images/Huawei.png";
import oppoLogo from "./images/oppo.png";
import vivoLogo from "./images/vivo.png";
import realmeLogo from "./images/realme.png";
import motorolaLogo from "./images/motorola.png";
import unknownLogo from "./images/question.png";
import lgLogo from "./images/Lg.png";
import oneplusLogo from "./images/oneplus.png";
import tecnoLogo from "./images/tecno.png";
import infinixLogo from "./images/infinix.png";
import googleLogo from "./images/google.png";
import nokiaLogo from "./images/nokia.png";
import { appTheme } from "scichart-example-dependencies";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
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
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new NumericAxis(wasmContext, {
        // Ensure there can be 1 label per item in the dataset.
        // Also see major/minor delta in the docs
        maxAutoTicks: 15,
        axisTitle: "Mobile phone manufacturer",
    });
    // We need the data value as plain text
    xAxis.labelProvider.numericFormat = ENumericFormat.NoFormat;

    // SciChart utility function to create HtmlImage elements from urls
    const emojies = await createImagesArrayAsync([
        appleLogo,
        samsungLogo,
        xiaomiLogo,
        huaweiLogo,
        oppoLogo,
        vivoLogo,
        realmeLogo,
        motorolaLogo,
        unknownLogo,
        lgLogo,
        oneplusLogo,
        tecnoLogo,
        infinixLogo,
        googleLogo,
        nokiaLogo,
    ]);

    // Override labelProvider.getLabelTexture() to return animage
    const getLabelTexture = (labelText: string, textureManager: TextureManager, labelStyle: TTextStyle) => {
        const index = parseInt(labelText);
        if (!isNaN(index)) {
            const emoji = emojies[index];
            if (emoji) {
                return textureManager.createTextureFromImage(emoji, 40, 40);
            }
        }
        return textureManager.createTextTexture([labelText], labelStyle);
    };
    xAxis.labelProvider.getLabelTexture = getLabelTexture;

    // If using asyncLabels = true, override this as well
    xAxis.labelProvider.getLabelTextureAsync = (
        labelText: string,
        textureManager: TextureManager,
        labelStyle: TTextStyle
    ) => Promise.resolve(getLabelTexture(labelText, textureManager, labelStyle));

    // Disable shared cache for this provider, otherwise other axes might pick up the emoji textures
    xAxis.labelProvider.useSharedCache = false;

    sciChartSurface.xAxes.add(xAxis);

    // Create a Y-Axis with standard properties
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            axisTitle: "Market Share (%)",
            growBy: new NumberRange(0, 0.1),
            labelPostfix: " %",
        })
    );

    // Add a column series.
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            // Name index to xvalue for category axis
            // Map percentage to yvalue
            // store the manufacturer name in the metadata (used to generate colors)
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: dataset.map((row, index) => index),
                yValues: dataset.map((row) => row.percent),
            }),
            strokeThickness: 0,
            // // Optional datalabels on series. To enable set a style and position
            // dataLabels: {
            //     horizontalTextPosition: EHorizontalTextPosition.Center,
            //     verticalTextPosition: EVerticalTextPosition.Top,
            //     style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(0,0,20,0) },
            //     color: appTheme.ForegroundColor,
            // },
            // each column occupies 50% of available space
            dataPointWidth: 0.5,
            // add a gradient fill in X (why not?)
            paletteProvider: PaletteFactory.createGradient(
                wasmContext,
                new GradientParams(new Point(0, 0), new Point(1, 1), [
                    { offset: 0, color: appTheme.VividPink },
                    { offset: 0.2, color: appTheme.VividOrange },
                    { offset: 0.3, color: appTheme.MutedRed },
                    { offset: 0.5, color: appTheme.VividGreen },
                    { offset: 0.7, color: appTheme.VividSkyBlue },
                    { offset: 0.9, color: appTheme.Indigo },
                    { offset: 1, color: appTheme.DarkIndigo },
                ]),
                { enableFill: true, enableStroke: true }
            ),
            // Bit more eye candy ;)
            animation: new WaveAnimation({ duration: 1000 }),
        })
    );

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Mobile Phone manufacturer market share (2022)",
            fontSize: 20,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

export class EmojiPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    private readonly pfYellow = parseColorToUIntArgb("FFCC4D");
    private readonly pfBlue = parseColorToUIntArgb("5DADEC");
    private readonly pfOrange = parseColorToUIntArgb("F58E01");
    private readonly pfRed = parseColorToUIntArgb("DE2A43");
    private readonly pfPink = parseColorToUIntArgb("FE7891");

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        if (xValue === 0 || xValue === 4 || xValue === 8) {
            return this.pfYellow;
        } else if (xValue === 1 || xValue === 7) {
            return this.pfBlue;
        } else if (xValue === 2 || xValue === 5) {
            return this.pfOrange;
        } else if (xValue === 3 || xValue === 6) {
            return this.pfRed;
        } else if (xValue === 9) {
            return this.pfPink;
        } else {
            return undefined;
        }
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
