import "./styles.css";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { SciChartSurfaceContext, TResolvedReturnType } from "scichart-react";
import { Rect } from "scichart";
import { createMainChart } from "./main-chart-config";

const ThresholdSlider = () => {
    // get reference to chart init result
    const context = useContext(SciChartSurfaceContext) as TResolvedReturnType<typeof createMainChart>;
    const [seriesViewRect, setSeriesViewRect] = useState(context.sciChartSurface.seriesViewRect);
    const viewport = context.sciChartSurface.renderSurface.viewportSize;

    // subscribe to seriesViewRectChange
    useEffect(() => {
        let previousViewRect = seriesViewRect;
        const checkViewRectChange = () => {
            const currentSeriesViewRect = context.sciChartSurface.seriesViewRect;

            if (!previousViewRect || !Rect.isEqual(currentSeriesViewRect, previousViewRect)) {
                previousViewRect = currentSeriesViewRect;
                setSeriesViewRect(currentSeriesViewRect);
            }
        };
        context.sciChartSurface.rendered.subscribe(checkViewRectChange);

        return () => {
            context.sciChartSurface.rendered.unsubscribe(checkViewRectChange);
        };
    }, []);

    const [width, setWidth] = useState("1600");
    const changeWidth: ChangeEventHandler<HTMLInputElement> = (event) => {
        setWidth(event.target.value);
        context.updateThreshold(parseInt(event.target.value));
    };

    if (!seriesViewRect) {
        return null;
    }

    return (
        <div
            className="absolute"
            style={{ fontSize: "0.8em", top: seriesViewRect.top - 13, right: viewport.width - seriesViewRect.right - 10 }}
        >
            Duration Threshold
            <br />
            <input type="range" min="0" max="2000" value={width} onChange={changeWidth} className="sc-range"></input>
        </div>
    );
};

export default ThresholdSlider;
