import * as React from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import load500Img from "../../Examples/FeaturedApps/PerformanceDemos/Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import ecgImg from "../../Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/javascript-vital-signs-ecg-medical-chart-example.jpg";
import audioAnalyzerImage from "../../Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/javascript-realtime-audio-analyzer.jpg";
// 2D Chart Types
import lineChartImg from "../../Examples/Charts2D/BasicChartTypes/LineChart/javascript-line-chart.jpg";
import digitalLineChartImg from "../../Examples/Charts2D/BasicChartTypes/DigitalLineChart/javascript-digital-line-chart.jpg";
import bubbleChartImg from "../../Examples/Charts2D/BasicChartTypes/BubbleChart/javascript-bubble-chart.jpg";
import candlestickImg from "../../Examples/Charts2D/BasicChartTypes/CandlestickChart/javascript-candlestick-chart.jpg";
import columnChartImg from "../../Examples/Charts2D/BasicChartTypes/ColumnChart/javascript-column-chart.jpg";
import fanChartImg from "../../Examples/Charts2D/BasicChartTypes/FanChart/javascript-fan-chart.jpg";
import realtimeMountainImg from "../../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/javascript-animated-mountain-chart.jpg";
import pieImg from "../../Examples/Charts2D/BasicChartTypes/PieChart/javascript-pie-chart.jpg";
import donutImg from "../../Examples/Charts2D/BasicChartTypes/DonutChart/javascript-donut-chart.jpg";
// Annotations and Legands
import editableAnnotationsImg from "../../Examples/Charts2D/ChartAnnotations/EditableAnnotations/javascript-chart-editable-annotations.jpg";
import tradeMarkersImg from "../../Examples/Charts2D/ChartAnnotations/TradeMarkers/javascript-stock-chart-buy-sell-markers.jpg";
// Stock Charts

import realtimeStockImg from "../../Examples/Charts2D/CreateStockCharts/RealtimeTickingStockCharts/javascript-realtime-ticking-stock-charts.jpg";
// Chart Axis API
import multipleXAxesImg from "../../Examples/Charts2D/ModifyAxisBehavior/MultipleXAxes/javascript-chart-with-multiple-x-axis.jpg";
// Styling and Theming
import pointMarkersImg from "../../Examples/Charts2D/StylingAndTheming/UsePointMarkers/javascript-chart-custom-poinmarkers.jpg";
import dashedLineImg from "../../Examples/Charts2D/StylingAndTheming/DashedLineStyling/javascript-chart-dashed-dotted-lines.jpg";
// Tooltips and Hit-Test
import hitTestApiImg from "../../Examples/Charts2D/TooltipsAndHittest/HitTestAPI/javascript-chart-hit-test-on-click.png";
// 3D Chart Types
import bubble3dImg from "../../Examples/Charts3D/Basic3DChartTypes/Bubble3DChart/javascript-3d-bubble-chart.jpg";
import "../Anim.css";

type TProps = {
    className: string;
    timeOut: number;
    interval: number;
};

const images = [
    load500Img,
    ecgImg,
    audioAnalyzerImage,
    lineChartImg,
    digitalLineChartImg,
    bubbleChartImg,
    candlestickImg,
    columnChartImg,
    fanChartImg,
    realtimeMountainImg,
    pieImg,
    donutImg,
    editableAnnotationsImg,
    tradeMarkersImg,
    realtimeStockImg,
    multipleXAxesImg,
    pointMarkersImg,
    dashedLineImg,
    hitTestApiImg,
    bubble3dImg
];

export default function ImageHeaderComponent(props: TProps) {
    const [image, setImage] = React.useState(Math.floor(Math.random() * images.length - 1) + 1);

    const interval1 = setInterval(() => {
        let one = 0;
        do {
            one = Math.floor(Math.random() * images.length);
        } while (image === one);
        setImage(one);

        clearInterval(interval1);
    }, props.interval);

    return (
        <div>
            <SwitchTransition>
                <CSSTransition key={image} timeout={props.timeOut} classNames="image-chart">
                    <img className={props.className} src={images[image]} />
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
}
