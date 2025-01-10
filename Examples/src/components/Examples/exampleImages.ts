import bandChartImage from "./Charts2D/BasicChartTypes/BandSeriesChart/javascript-band-chart.jpg";
import bubbleChartImage from "./Charts2D/BasicChartTypes/BubbleChart/javascript-bubble-chart.jpg";
import candlestickChartImage from "./Charts2D/BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import columnChartImage from "./Charts2D/BasicChartTypes/ColumnChart/javascript-column-chart.jpg";
import digitalBandChartImage from "./Charts2D/BasicChartTypes/DigitalBandSeriesChart/javascript-digital-band-chart.jpg";
import lineChartImage from "./Charts2D/BasicChartTypes/LineChart/javascript-line-chart.jpg";

export type ExampleImagePath =
    | "javascript-band-chart.jpg"
    | "javascript-bubble-chart.jpg"
    | "javascript-candlestick-chart.jpg"
    | "javascript-column-chart.jpg"
    | "javascript-digital-band-chart.jpg"
    | "javascript-line-chart.jpg";

export const getExampleImage = (filename: string): string => {
    switch (filename) {
        case "javascript-band-chart.jpg":
            return bandChartImage;
        case "javascript-bubble-chart.jpg":
            return bubbleChartImage;
        case "javascript-candlestick-chart.jpg":
            return candlestickChartImage;
        case "javascript-column-chart.jpg":
            return columnChartImage;
        case "javascript-digital-band-chart.jpg":
            return digitalBandChartImage;
        case "javascript-line-chart.jpg":
            return lineChartImage;
        default:
            console.warn(`Image not found: ${filename}`);
            return "";
    }
};
