import * as React from "react";
import { SciChart3DSurface, TSciChart3D, ColumnRenderableSeries3D } from "scichart";
import { drawExample, EColumn3DType, createPointMarker3D, EColumnColorMode } from "./drawExample";
import { SciChartReact, TResolvedReturnType } from "scichart-react";

const column3DTypeSelect = Object.values(EColumn3DType);
const colorModeSelect = Object.values(EColumnColorMode);

// REACT COMPONENT
export default function Column3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>(undefined);
    const controlsRef = React.useRef<{
        updateColors: (colorMode: EColumnColorMode) => void;
        updatePointMarker: (type: EColumn3DType) => void;
    }>(undefined);

    const [column3DType, setColumn3DType] = React.useState<EColumn3DType>(EColumn3DType.CylinderPointMarker3D);
    const [renderableSeries, setRenderableSeries] = React.useState<ColumnRenderableSeries3D>();
    const [dataPointWidth, setDataPointWidth] = React.useState<number>(1);
    const [colorMode, setColorMode] = React.useState<EColumnColorMode>(EColumnColorMode.X);

    const handleColumn3DTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = e.target.value as EColumn3DType;
        if (newValue !== column3DType) {
            setColumn3DType(newValue);
            controlsRef.current.updatePointMarker(newValue);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = e.target.value as EColumnColorMode;
        if (newValue !== colorMode) {
            setColorMode(newValue);
            controlsRef.current.updateColors(newValue);
        }
    };

    const handleDataPointWidthChange = (_: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        const newDataPointWidth = Number(newValue);
        setDataPointWidth(newDataPointWidth);
        renderableSeries.dataPointWidthX = newDataPointWidth;
        renderableSeries.dataPointWidthZ = newDataPointWidth;
    };

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <label className="sc-control">
                    Column Shape
                    <select value={column3DType} onChange={handleColumn3DTypeChange} className="sc-select">
                        {column3DTypeSelect.map((el) => (
                            <option key={el} value={el}>
                                {el}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="sc-control">
                    Color Mode
                    <select value={colorMode} onChange={handleColorChange} className="sc-select">
                        {colorModeSelect.map((el) => (
                            <option key={el} value={el}>
                                {el}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="sc-control flex flex-col gap-0">
                    <span>Data-point width: {dataPointWidth.toFixed(2)}</span>
                    <input
                        type="range"
                        className="sc-range -mt-1"
                        id="seriesCount"
                        onChange={(event) => handleDataPointWidthChange(event, event.currentTarget.valueAsNumber)}
                        step={0.05}
                        min={0}
                        max={1}
                        value={dataPointWidth}
                    />
                </label>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={({ sciChartSurface, controls }: TResolvedReturnType<typeof drawExample>) => {
                    sciChartSurfaceRef.current = sciChartSurface;
                    controlsRef.current = controls;
                    setRenderableSeries(sciChartSurface.renderableSeries.get(0) as ColumnRenderableSeries3D);
                }}
            />
        </div>
    );
}
