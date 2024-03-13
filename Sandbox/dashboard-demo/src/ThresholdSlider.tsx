import { useContext, useEffect, useState } from 'react';
import { appTheme } from 'scichart-example-dependencies';
import { Rect } from 'scichart';
import { TMainChartConfigFunc } from './main-chart-config';
import { SciChartSurfaceContext } from 'scichart-react';

const ThresholdSlider = () => {
    // get reference to chart init result
    const context = useContext(SciChartSurfaceContext) as Awaited<ReturnType<TMainChartConfigFunc>>;
    const [seriesViewRect, setSeriesViewRect] = useState(context.sciChartSurface.seriesViewRect);
    const viewport = context.sciChartSurface.renderSurface.viewportSize;

    // subscribe to seriesViewRectChange
    useEffect(() => {
        if (!context) {
            return null;
        }

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
    }, [context]);

    const [width, setWidth] = useState('1600');
    const changeWidth: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setWidth(event.target.value);
        context.updateThreshold(parseInt(event.target.value));
    };

    if (!seriesViewRect) {
        return null;
    }

    return (
        <div
            style={{
                top: seriesViewRect.top,
                right: viewport.width - seriesViewRect.right,
                position: 'absolute',
                color: appTheme.ForegroundColor,
            }}
        >
            Duration Threshold
            <br />
            <input type='range' min='0' max='2000' value={width} onChange={changeWidth}></input>
        </div>
    );
};

export default ThresholdSlider;
