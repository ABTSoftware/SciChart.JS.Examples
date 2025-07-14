import { 
    PolarNumericAxis,
    SciChartSurface,
    NumberRange,
    EDraggingGripPoint,
    EAxisAlignment,
    EPolarAxisMode,
    LineArrowAnnotation,
    XyDataSeries,
    NumericAxis,
    ESciChartSurfaceType,
    LineAnnotation,
    Rect,
    SciChartPolarSubSurface,
    RadianLabelProvider,
    SplineMountainRenderableSeries,
    EAutoRange,
    PolarArcAnnotation,
} from "scichart";
import { appTheme } from "../../../theme";

function calculateDiameterProjection(x: number, y: number) {
    return {
        x2: x % Math.PI < Math.PI ? Math.PI / 2 : (Math.PI * 3) / 2,
        y2: y * Math.sin(x)
    };
}

export async function drawExample(rootElement: string | HTMLDivElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme
    })

    // Add master axes
    const xAxis = new NumericAxis(wasmContext, {
        labelStyle: { color: "white" },
        growBy: new NumberRange(0, 0.34),   // start the mountain drawing at around 0.25 of the chart (from polar center)
        isInnerAxis: true,                  // to not push chart upwards and overcomplicate centering calculations
        autoRange: EAutoRange.Always,       // allow change of xAxis range on fifo changes
        flippedCoordinates: true,           // increment from right to left
        
        autoTicks: false,
        majorDelta: Math.PI / 4,
        labelProvider: new RadianLabelProvider(),
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoTicks: false,
        majorDelta: 0.5,
        labelStyle: { color: "#FFFFFF" }
    });
    sciChartSurface.yAxes.add(yAxis);

    // calculate yAxis range based on the aspect ratio of the chart (to sync the yRange with the polar chart diameter)
    const aspectRatio = sciChartSurface.viewRect.height / sciChartSurface.viewRect.width; // likely a value like 0.66
    const padding = aspectRatio * 2

    yAxis.visibleRange = new NumberRange(
        -2 * padding,  // -2 is the min value that `sumVector` can reach
        2 * padding    // same here, but positive
    );

    // add the 3 cartesian mountain projections of the polar vectors
    const vector1Mountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [],
            yValues: [],
            fifoCapacity: 300 // allow 300 points at once until sweeping happens
        }),
        fill: "#BB000022",
        stroke: "#BB0000",
        strokeThickness: 3
    });

    const vector2Mountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [],
            yValues: [],
            fifoCapacity: 300
        }),
        fill: "#00FF0022",
        stroke: "#00FF00",
        strokeThickness: 3
    });

    const vectorSumMountain = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [],
            yValues: [],
            fifoCapacity: 300
        }),
        fill: "#DDDDDD22",
        stroke: "#AAAAAA",
        strokeThickness: 3
    });

    sciChartSurface.renderableSeries.add(vectorSumMountain, vector1Mountain, vector2Mountain);

    // Add polar subchart on the left half of the screen
    const polarSub = SciChartPolarSubSurface.createSubSurface(sciChartSurface, {
        surfaceType: ESciChartSurfaceType.Polar2D,
        position: new Rect(0, 0, 0.5, 1) // left half of the screen
    });

    // add angular x / y axes
    const angularAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        isInnerAxis: true,
        visibleRange: new NumberRange(0, Math.PI * 2), // full circle
        labelStyle: { color: "#FFFFFF" },
        drawMajorTickLines: false,
        drawMinorTickLines: false,

        autoTicks: false,
        majorDelta: Math.PI / 2,
        labelProvider: new RadianLabelProvider(),
    });
    polarSub.xAxes.add(angularAxis);

    const radialAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 2), // max value of `vectorSum`, since our 2 vectors are normalized to [0, 1]
        
        autoTicks: false,
        majorDelta: 1,
        startAngle: Math.PI / 2, // Start at the top (12 o'clock)
    });
    polarSub.yAxes.add(radialAxis);

    // Now we add pointer annotations (vectors, projections, sum vector, angle arc)

    // 1. Vector1 (red one)
    const vector1 = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        x2: 2.8,
        y2: 1,
        strokeThickness: 3,
        stroke: "#FF0000",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: true,
        dragPoints: [EDraggingGripPoint.x2y2],
        selectionBoxStroke: "#FFAAAA88"
    });
    const vector1ToDiameter = new LineAnnotation({ // (optional) - projection of vector1 to the diameter line
        stroke: "#AA0000",
        strokeThickness: 3
    });

    // 2. Vector2 (green one)
    const vector2 = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0.8,
        strokeThickness: 3,
        stroke: "#00FF00",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: true,
        dragPoints: [EDraggingGripPoint.x2y2],
        selectionBoxStroke: "#AAFFAA88"
    });
    const vector2ToDiameter = new LineAnnotation({ // (optional)
        stroke: "#00AA00",
        strokeThickness: 3
    });

    // 3. VectorSum (white one)
    const vectorSum = new LineArrowAnnotation({
        x1: 0,
        y1: 0,
        strokeThickness: 3,
        stroke: "white",
        arrowStyle: {
            headLength: 10,
            headWidth: 10,
            headDepth: 0.6
        },
        isEditable: false
    });
    const vectorSumToDiameter = new LineAnnotation({ // (optional)
        stroke: "#AAAAAA",
        strokeThickness: 3
    });

    // (optional) draw lines from x2y2 of `vector1` and `vector2` to the x2y2 of `vectorSum`
    const vector1ToSumLine = new LineAnnotation({
        stroke: "gray",
        strokeThickness: 2,
    });
    const vector2ToSumLine = new LineAnnotation({
        stroke: "gray",
        strokeThickness: 2
    }); 

    // 4. Arc annotation acting as a degree indicator between `vector1` and `vector2`
    const vectorArc = new PolarArcAnnotation({
        y2: 0, // startRadius is always 0, the rest (y1, x2, x1) will be calculated in `updatePolarAnnotations()`
        stroke: "#FFFFFF",
        fill: "#FFFFFF22",
    })

    // the appending order of the annotation is important, as the `vectorArc` will be rendered first, 
    // and so below all the other annotations, and so on
    polarSub.annotations.add(
        vectorArc,
        vector1ToSumLine, vector2ToSumLine,
        vector1ToDiameter, vector2ToDiameter, vectorSumToDiameter,
        vector1, vector2, vectorSum,
    );

    function updatePolarAnnotations() {
        if (!vector1 || !vector2) {
            return;
        }

        // Normalize to (0, 1)
        vector1.y2 = Math.max(0, Math.min(vector1.y2, 1));
        vector2.y2 = Math.max(0, Math.min(vector2.y2, 1));

        const v1x = vector1.y2 * Math.cos(vector1.x2); // x component of vector1
        const v1y = vector1.y2 * Math.sin(vector1.x2); // y component of vector1

        const v2x = vector2.y2 * Math.cos(vector2.x2); // x component of vector2
        const v2y = vector2.y2 * Math.sin(vector2.x2); // y component of vector2

        const sumX = v1x + v2x;
        const sumY = v1y + v2y;

        // Convert back to polar coordinates
        vectorSum.x2 = Math.atan2(sumY, sumX); // angle
        vectorSum.y2 = Math.sqrt(sumX * sumX + sumY * sumY); // magnitude

        // Update perpendicular projections
        // vector1ToDiameter
        vector1ToDiameter.x1 = vector1.x2;
        vector1ToDiameter.y1 = vector1.y2;

        const v1Projection = calculateDiameterProjection(vector1.x2, vector1.y2);
        vector1ToDiameter.x2 = v1Projection.x2;
        vector1ToDiameter.y2 = v1Projection.y2;

        // vector2ToDiameter
        vector2ToDiameter.x1 = vector2.x2;
        vector2ToDiameter.y1 = vector2.y2;

        const v2Projection = calculateDiameterProjection(vector2.x2, vector2.y2);
        vector2ToDiameter.x2 = v2Projection.x2;
        vector2ToDiameter.y2 = v2Projection.y2;

        // vectorSumToDiameter
        vectorSumToDiameter.x1 = vectorSum.x2;
        vectorSumToDiameter.y1 = vectorSum.y2;
        const sumProjection = calculateDiameterProjection(vectorSum.x2, vectorSum.y2);
        vectorSumToDiameter.x2 = sumProjection.x2;
        vectorSumToDiameter.y2 = sumProjection.y2;

        // Update lines to sum vector
        vector1ToSumLine.x1 = vector1.x2;
        vector1ToSumLine.y1 = vector1.y2;
        vector1ToSumLine.x2 = vectorSum.x2;
        vector1ToSumLine.y2 = vectorSum.y2;

        vector2ToSumLine.x1 = vector2.x2;
        vector2ToSumLine.y1 = vector2.y2;
        vector2ToSumLine.x2 = vectorSum.x2;
        vector2ToSumLine.y2 = vectorSum.y2;

        // Update the arc annotation from vector1 to vector2, ensuring the angle is within [0, PI]
        // We always want the shortest arc, so we calculate the angle difference and adjust accordingly
        const angle1 = vector1.x2 % (2 * Math.PI);
        const angle2 = vector2.x2 % (2 * Math.PI);

        let delta = (angle2 - angle1 + 2 * Math.PI) % (2 * Math.PI);

        if (delta > Math.PI) {
            // The arc goes the long way around with the angle > 180 degrees, so we reverse direction
            vectorArc.x1 = angle2;
            vectorArc.x2 = angle1;
        } else {
            vectorArc.x1 = angle1;
            vectorArc.x2 = angle2;
        }
        
        // optionally keep height of the angle arc smaller than smallest vector
        vectorArc.y1 = Math.min(vector1.y2, vector2.y2) / 2; 
        
        // optionally add value to the mountains if the animation is not running
        if (!isAnimating) {
            updateCartesianProjection();
        }
    }
    updatePolarAnnotations(); // call once to init sum, projections and arc

    // On change of any of the 2 vectors, update the annotations
    vector1.dragDelta.subscribe(relativeCoords => updatePolarAnnotations());
    vector2.dragDelta.subscribe(relativeCoords => updatePolarAnnotations());
    
    function updateCartesianProjection(){
        // calculate with the height and angle, the projection of the vectors from 0-2
        const vector1Projection = calculateDiameterProjection(vector1.x2, vector1.y2);
        const vector2Projection = calculateDiameterProjection(vector2.x2, vector2.y2);
        const vectorSumProjection = calculateDiameterProjection(vectorSum.x2, vectorSum.y2);
        
        const lastXIndex = vector1Mountain.dataSeries.count() - 1;
        const pastX = vector1Mountain.dataSeries.getNativeXValues().get(lastXIndex) ?? 0; 
        const newX = pastX + Math.PI / 180; // Increment by 1 degree in radians

        // Update the data series of the mountains
        (vector1Mountain.dataSeries as XyDataSeries).append(newX, vector1Projection.y2);
        (vector2Mountain.dataSeries as XyDataSeries).append(newX, vector2Projection.y2);
        (vectorSumMountain.dataSeries as XyDataSeries).append(newX, vectorSumProjection.y2);
    }

    // Rotate vectors by a small angle
    function rotateVectors() {
        const angleIncrement = Math.PI / 180; // 1 degree in radians
        vector1.x2 += angleIncrement;
        vector2.x2 += angleIncrement;
        vector1.dragDelta.raiseEvent(); // trigger annotation update (see lines 305-306)
    }

    // Animation controls
    let isAnimating = true;

    function animate() {
        if (!isAnimating) return;

        updateCartesianProjection();
        rotateVectors();

        requestAnimationFrame(animate);
    }

    animate(); // call once to start the animation

    return { 
        sciChartSurface, 
        wasmContext, 
        controls: {
            startAnimation: () => {
                if (isAnimating) return; // Prevent multiple animations (speeding things up uncontrollably)
                isAnimating = true;
                animate();
            },
            stopAnimation: () => {
                isAnimating = false;
            }
        }
    };
}
