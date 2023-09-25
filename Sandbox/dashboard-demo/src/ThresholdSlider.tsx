import { useContext, useEffect, useState } from 'react';
import { SurfaceContext } from './SurfaceContext';
import { TMainChartConfigFunc } from './chart-configurations';
import { appTheme } from 'scichart-example-dependencies';
import { Rect } from 'scichart';

const ThresholdSlider = () => {
    // get reference to chart init result
    const context = useContext(SurfaceContext) as Awaited<ReturnType<TMainChartConfigFunc>>;
    const [seriesViewRect, setSeriesViewRect] = useState(context.sciChartSurface.seriesViewRect)
    const viewport = context.sciChartSurface.renderSurface.viewportSize;

    // subscribe to seriesViewRectChange
    useEffect(() => {
        if (context) {
            let previousViewRect = seriesViewRect;
            const checkViewRectChange = () => {
                const currentSeriesViewRect = context.sciChartSurface.seriesViewRect
                if (!Rect.isEqual(currentSeriesViewRect, previousViewRect)) {
                    previousViewRect = currentSeriesViewRect
                    setSeriesViewRect(currentSeriesViewRect)
                }
            };
            context.sciChartSurface.rendered.subscribe(checkViewRectChange);
        }
    }, [context]);

    const [width, setWidth] = useState('1600');
    const changeWidth: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setWidth(event.target.value);
        context.updateThreshold(parseInt(event.target.value));
    };


    return (
        <div
            style={{
                top: seriesViewRect.top,
                right: viewport.width - seriesViewRect.right,
                position: 'absolute',
                color: appTheme.ForegroundColor,
                // gridArea: "1 / 4 / 2 / -1"
                // transform: 'rotate(270deg)'
            }}
        >
            Duration Threshold
            <br />
            <input type='range' min='0' max='2000' value={width} onChange={changeWidth}></input>
        </div>
    );
};

export default ThresholdSlider;
