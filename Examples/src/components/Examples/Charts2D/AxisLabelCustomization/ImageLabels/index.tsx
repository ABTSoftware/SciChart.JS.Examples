import * as React from "react";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TTextStyle } from "scichart/Charting/Visuals/Axis/AxisCore";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { TextureManager, TTextureObject } from "scichart/Charting/Visuals/TextureManager/TextureManager";
import { EAutoRange } from "scichart/types/AutoRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { createImagesArrayAsync } from "scichart/utils/imageUtil";
import classes from "../../../Examples.module.scss";
import { EmojiPaletteProvider } from "../MultiLineLabels";
import emojiUrl1 from "./emojies/e1-face-with-tears-of-joy.png";
import emojiUrl10 from "./emojies/e10-smiling-face-with-smiling-eyes.png";
import emojiUrl2 from "./emojies/e2-loudly-crying-face.png";
import emojiUrl3 from "./emojies/e3-pleading-face.png";
import emojiUrl4 from "./emojies/e4-red-heart_2764.png";
import emojiUrl5 from "./emojies/e5-rolling-on-the-floor-laughing.png";
import emojiUrl6 from "./emojies/e6-sparkles.png";
import emojiUrl7 from "./emojies/e7-smiling-face-with-heart-eyes.png";
import emojiUrl8 from "./emojies/e8-folded-hands.png";
import emojiUrl9 from "./emojies/e9-smiling-face-with-hearts.png";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext);
    // We need the data value as plain text
    xAxis.labelProvider.numericFormat = ENumericFormat.NoFormat;

    // SciChart utility function to create HtmlImage elements from urls
    const emojies = await createImagesArrayAsync([
        emojiUrl1,
        emojiUrl2,
        emojiUrl3,
        emojiUrl4,
        emojiUrl5,
        emojiUrl6,
        emojiUrl7,
        emojiUrl8,
        emojiUrl9,
        emojiUrl10
    ]);

    const getLabelTexture = (
        labelText: string,
        textureManager: TextureManager,
        labelStyle: TTextStyle
    ): TTextureObject => {
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
    ) => Promise.resolve(getLabelTexture(labelText, textureManager, labelStyle))

    // Disable shared cache for this provider, otherwise other axes might pick up the emoji textures
    xAxis.labelProvider.useSharedCache = false;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    // Pass array to axisTitle to make it multiline
    yAxis.axisTitle = ["Number of tweets that contained", "at least one emoji per ten thousand tweets"];
    yAxis.axisTitleStyle.fontSize = 14;
    sciChartSurface.yAxes.add(yAxis);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        strokeThickness: 0,
        dataPointWidth: 0.5,
        paletteProvider: new EmojiPaletteProvider()
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [220, 170, 105, 85, 80, 75, 60, 50, 45, 45]);
    columnSeries.dataSeries = dataSeries;

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ImageLabels() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
