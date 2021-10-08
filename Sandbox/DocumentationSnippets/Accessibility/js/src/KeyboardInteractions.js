import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart";
import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { EClipMode } from "scichart/Charting/Visuals/Axis/AxisBase2D";
import { Point } from "scichart/Core/Point";
import { EXyDirection } from "scichart/types/XyDirection";

export async function keyboardModifier(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new KeyboardZoomPanModifier({ scrollFactor: 0.1 }));

    // focus on scichart root to allow scichart detect keyboard events
    sciChartSurface.domChartRoot.focus();
}

const DEFAULT_SCROLL_DELTA = 100;
const DEFAULT_ZOOM_DELTA = 120;

class KeyboardZoomPanModifier extends ChartModifierBase2D {
    constructor(options) {
        super(options);

        this.type = "KeyboardZoomPan";
        /**
         * Modifies the speed of  zoom, for example growFactor = 0.001 means each 'click'
         * zooms the chart 0.1%
         */
        this.growFactor = options && options.growFactor || 0.001;
    
        /**
         * Modifies the speed of scroll, for example scrollFactor = 0.001 means each 'click'
         * scrolls the chart 0.1%
         */
        this.scrollFactor = options && options.scrollFactor || 0.001;

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    scroll(xDelta, yDelta) {
        // Scroll the X,YAxis by the number of pixels since the last update
        const token = this.parentSurface.suspendUpdates();

        if ([EXyDirection.XDirection, EXyDirection.XyDirection].includes(this.xyDirection)) {
            this.parentSurface.xAxes.asArray().forEach(axis => {
                const delta = (axis.isHorizontalAxis ? xDelta : -yDelta) * this.scrollFactor;
                axis.scroll(axis.flippedCoordinates ? -delta : delta, EClipMode.None);
            });
        }
        if ([EXyDirection.YDirection, EXyDirection.XyDirection].includes(this.xyDirection)) {
            this.parentSurface.yAxes.asArray().forEach(axis => {
                const delta = (axis.isHorizontalAxis ? -xDelta : yDelta) * this.scrollFactor;
                axis.scroll(axis.flippedCoordinates ? -delta : delta, EClipMode.None);
            });
        }

        token.resume();
    }

    onAttach() {
        // set tabIndex attribute of the chart root element if it was not set externally
        this.parentSurface.domChartRoot.tabIndex = this.parentSurface.domChartRoot.tabIndex || 0;

        // subscribe to keyboard input event
        this.parentSurface.domChartRoot.addEventListener("keydown", this.handleKeyDown);
    }

    onDetach() {
        // unsubscribe from keyboard input event
        this.parentSurface.domChartRoot.removeEventListener("keydown", this.handleKeyDown);
    }

    /**
     * Performs the zoom operation around the mouse point
     * @param mousePoint The X,Y location of the mouse at the time of the zoom
     * @param delta the delta factor of zoom
     */
    performZoom(mousePoint, delta) {
        const fraction = this.growFactor * delta;
        if ([EXyDirection.XDirection, EXyDirection.XyDirection].includes(this.xyDirection)) {
            this.parentSurface.xAxes.asArray().forEach(axis => {
                this.growBy(mousePoint, axis, fraction);
            });
        }
        if ([EXyDirection.YDirection, EXyDirection.XyDirection].includes(this.xyDirection)) {
            this.parentSurface.yAxes.asArray().forEach(axis => {
                this.growBy(mousePoint, axis, fraction);
            });
        }
    }

    handleKeyDown(event) {
        // ignore key combinations
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        switch (event.key) {
            case "ArrowUp":
                this.scroll(0, DEFAULT_SCROLL_DELTA);
                break;
            case "ArrowDown":
                this.scroll(0, -DEFAULT_SCROLL_DELTA);
                break;
            case "ArrowRight":
                this.scroll(DEFAULT_SCROLL_DELTA, 0);
                break;
            case "ArrowLeft":
                this.scroll(-DEFAULT_SCROLL_DELTA, 0);
                break;
            case "+": {
                const zoomPoint = new Point(
                    this.parentSurface.seriesViewRect.width / 2,
                    this.parentSurface.seriesViewRect.height / 2
                );
                this.performZoom(zoomPoint, -DEFAULT_ZOOM_DELTA);
                break;
            }
            case "-": {
                const zoomPoint = new Point(
                    this.parentSurface.seriesViewRect.width / 2,
                    this.parentSurface.seriesViewRect.height / 2
                );
                this.performZoom(zoomPoint, DEFAULT_ZOOM_DELTA);
                break;
            }
            default:
                return;
        }

        // prevent default behavior if the key is used by the modifier
        event.preventDefault();
    }
}