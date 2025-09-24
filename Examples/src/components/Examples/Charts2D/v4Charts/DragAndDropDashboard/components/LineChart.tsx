import { useEffect, useRef, useState } from 'react';
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EAutoRange,
  NumberRange
} from 'scichart';

interface LineChartProps {
  title?: string;
}

export function LineChart({ title = "Line Chart" }: LineChartProps) {
  const sciChartSurfaceRef = useRef<SciChartSurface | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divElementRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  // Define drawFallbackChart function before it's used in useEffect
  // function drawFallbackChart() {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;

  //   // Set canvas dimensions to match its display size
  //   const rect = canvas.getBoundingClientRect();
  //   canvas.width = rect.width;
  //   canvas.height = rect.height;

  //   // Handle high DPI displays
  //   const dpr = window.devicePixelRatio || 1;
  //   if (dpr > 1) {
  //     canvas.width = rect.width * dpr;
  //     canvas.height = rect.height * dpr;
  //     ctx.scale(dpr, dpr);
  //   }

  //   // Clear the canvas
  //   ctx.clearRect(0, 0, rect.width, rect.height);

  //   // Set up chart dimensions
  //   const padding = 40;
  //   const chartWidth = rect.width - padding * 2;
  //   const chartHeight = rect.height - padding * 2;

  //   // Draw axes
  //   ctx.beginPath();
  //   ctx.strokeStyle = '#333';
  //   ctx.lineWidth = 2;
    
  //   // X-axis
  //   ctx.moveTo(padding, rect.height - padding);
  //   ctx.lineTo(rect.width - padding, rect.height - padding);
    
  //   // Y-axis
  //   ctx.moveTo(padding, padding);
  //   ctx.lineTo(padding, rect.height - padding);
  //   ctx.stroke();

  //   // Generate sine wave data
  //   const points = [];
  //   const numPoints = 100;
  //   for (let i = 0; i < numPoints; i++) {
  //     const x = i * (chartWidth / numPoints) + padding;
  //     // Sine wave: amplitude * sin(frequency * x + phase) + offset
  //     const y = rect.height - padding - (Math.sin(i * 0.1) * chartHeight / 2 + chartHeight / 2);
  //     points.push({ x, y });
  //   }

  //   // Draw the line
  //   ctx.beginPath();
  //   ctx.strokeStyle = '#ff6600';
  //   ctx.lineWidth = 3;
  //   ctx.moveTo(points[0].x, points[0].y);
    
  //   for (let i = 1; i < points.length; i++) {
  //     ctx.lineTo(points[i].x, points[i].y);
  //   }
    
  //   ctx.stroke();

  //   // Add axis labels
  //   ctx.fillStyle = '#333';
  //   ctx.font = '12px Arial';
  //   ctx.textAlign = 'center';
    
  //   // X-axis label
  //   ctx.fillText('X Axis', rect.width / 2, rect.height - 10);
    
  //   // Y-axis label
  //   ctx.save();
  //   ctx.translate(15, rect.height / 2);
  //   ctx.rotate(-Math.PI / 2);
  //   ctx.fillText('Y Axis', 0, 0);
  //   ctx.restore();
  // }

  useEffect(() => {
    async function initSciChart() {
      try {
        // Load SciChart WASM module from CDN
        await SciChartSurface.loadWasmFromCDN();
        
        // Create the SciChartSurface
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementRef.current!);
        sciChartSurfaceRef.current = sciChartSurface;

        // Create an X axis
        const xAxis = new NumericAxis(wasmContext, {
          axisTitle: "X Axis",
          autoRange: EAutoRange.Once
        });

        // Create a Y axis
        const yAxis = new NumericAxis(wasmContext, {
          axisTitle: "Y Axis",
          autoRange: EAutoRange.Once,
          visibleRange: new NumberRange(-1.1, 1.1)
        });

        // Add the axes to the chart
        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        // Create a data series
        const dataSeries = new XyDataSeries(wasmContext);

        // Generate sine wave data
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
          const x = i;
          const y = Math.sin(i * 0.1);
          dataSeries.append(x, y);
        }

        // Create a line series with the data
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
          dataSeries,
          stroke: "#ff6600",
          strokeThickness: 3
        });

        // Add the line series to the chart
        sciChartSurface.renderableSeries.add(lineSeries);

        // Optional: Zoom to fit the data
        sciChartSurface.zoomExtents();
        
        // If we get here, SciChart loaded successfully
        console.log("SciChart initialized successfully");
      } catch (error) {
        console.error("Error initializing SciChart:", error);
        // Ensure fallback is triggered
        setUseFallback(true);
      }
    }

    // Initialize SciChart
    initSciChart();

    // Cleanup when component unmounts
    return () => {
      // window.removeEventListener('resize', handleResize);
      if (sciChartSurfaceRef.current) {
        sciChartSurfaceRef.current.delete();
        sciChartSurfaceRef.current = undefined;
      }
    };
  }, [useFallback]);


  // Function has been moved before the useEffect hooks

  return (
    <div className="line-chart-container" style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {title && <div style={{ textAlign: 'center', margin: '0 0 0 0' }}>{title}</div>}
      <div style={{ flex: 1, position: 'relative', flexGrow: 1 }}>
        {/* SciChart container */}
        <div 
          ref={divElementRef}
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f9f9f9',
            // border: '1px solid #ddd',
            borderRadius: '4px',
            // display: useFallback ? 'none' : 'block'
          }}
        />
        {/* Fallback canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '4px',
            display: useFallback ? 'block' : 'none'
          }}
        />
      </div>
    </div>
  );
}

export default LineChart;