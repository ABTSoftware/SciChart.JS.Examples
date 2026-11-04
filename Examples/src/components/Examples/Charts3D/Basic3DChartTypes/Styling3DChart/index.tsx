import { useRef, useState } from 'react';
import { drawExample, TAxis, TSelectedAxisPlane } from './drawExample';
import { SciChartReact, TResolvedReturnType } from 'scichart-react';
import { ExpandMoreIcon } from '../../../icons';

import { appTheme } from '../../../theme';
import { EAxisPlaneDrawLabelsMode, E3DLabelOrientationMode } from 'scichart';

type AxisDemoConfig = {
    fontSize: number;
    titleOffset: number;
    tickLabelsOffset: number;
    labelOrientation: E3DLabelOrientationMode;
    majorGridLines: boolean;
    minorGridLines: boolean;
    bandsFill: string;
    majorGridColor: string;
    minorGridColor: string;
};

const defaultAxisConfig: AxisDemoConfig = {
    fontSize: 20,
    titleOffset: 10,
    tickLabelsOffset: 10,
    labelOrientation: E3DLabelOrientationMode.Auto,
    majorGridLines: false,
    minorGridLines: false,
    bandsFill: appTheme.DarkIndigo + '44',
    majorGridColor: '#5588AA',
    minorGridColor: '#225588',
};

export default function Styling3DChart() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>['controls']>(null);

    const [selectedAxis, setSelectedAxis] = useState<TAxis>('x');
    const [axisSettings, setAxisSettings] = useState<Record<TAxis, AxisDemoConfig>>({
        x: { ...defaultAxisConfig },
        y: { ...defaultAxisConfig },
        z: { ...defaultAxisConfig },
    });
    const [selectedPlane, setSelectedPlane] = useState<TSelectedAxisPlane>('none');
    const [visibilityMode, setVisibilityMode] = useState('auto');
    const [planeDrawTitlesMode, setPlaneDrawTitlesMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeDrawLabelsMode, setPlaneDrawLabelsMode] = useState<EAxisPlaneDrawLabelsMode>(
        EAxisPlaneDrawLabelsMode.Both
    );
    const [planeIsVisible, setPlaneIsVisible] = useState('true');
    const [expanded, setExpanded] = useState<string | false>('panel1');

    // Helper to ensure color strings are valid for <input type="color" className="sc-input">
    const formatHexForInput = (color: string) => {
        if (!color || !color.startsWith('#')) return '#000000';
        return color.substring(0, 7);
    };

    const updateAxisSetting = (key: keyof AxisDemoConfig, value: AxisDemoConfig[keyof AxisDemoConfig]) => {
        setAxisSettings((prev) => ({
            ...prev,
            [selectedAxis]: { ...prev[selectedAxis], [key]: value },
        }));
    };

    const handlePanelToggle = (panel: string) => (event: React.SyntheticEvent<HTMLDetailsElement>) => {
        if (event.currentTarget.open) setExpanded(panel);
        else setExpanded((current) => (current === panel ? false : current));
    };

    const handleLabelFontSize = (newValue: number) => {
        updateAxisSetting('fontSize', newValue);
        controlsRef.current?.setAxisLabelFontSize(newValue, selectedAxis);
    };

    const handleTitleOffset = (newValue: number) => {
        updateAxisSetting('titleOffset', newValue);
        controlsRef.current?.setTitleOffset(newValue, selectedAxis);
    };

    const handleTickLabelsOffset = (newValue: number) => {
        updateAxisSetting('tickLabelsOffset', newValue);
        controlsRef.current?.setTickLabelsOffset(newValue, selectedAxis);
    };

    const handleLabelOrientationModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMode = e.target.value as E3DLabelOrientationMode;
        updateAxisSetting('labelOrientation', newMode);
        controlsRef.current?.setLabelOrientationMode(newMode, selectedAxis);
    };

    const handleEnableMajorGridLines = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        updateAxisSetting('majorGridLines', checked);
        controlsRef.current?.enableMajorGridLines(checked, selectedAxis);
    };

    const handleEnableMinorGridLines = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        updateAxisSetting('minorGridLines', checked);
        controlsRef.current?.enableMinorGridLines(checked, selectedAxis);
    };

    const handleAxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAxis = e.target.value as TAxis;
        setSelectedAxis(newAxis);
        controlsRef.current?.updateAxisTitleColor(newAxis);
    };

    const handleBandsFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting('bandsFill', color);
        controlsRef.current?.setAxisBandsFill(color, selectedAxis);
    };

    const handleMajorGridLineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting('majorGridColor', color);
        controlsRef.current?.setMajorGridLineColor(color, selectedAxis);
    };

    const handleMinorGridLineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        updateAxisSetting('minorGridColor', color);
        controlsRef.current?.setMinorGridLineColor(color, selectedAxis);
    };

    // Plane handlers
    const handlePlaneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as TSelectedAxisPlane;
        setSelectedPlane(newValue);
        controlsRef.current?.setPlaneBackground(newValue);
    };

    const handleVisibilityMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setVisibilityMode(newValue);
        controlsRef.current?.setVisibilityMode(selectedPlane, newValue);
    };

    const handlePlaneDrawTitlesMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawTitlesMode(newValue);
        controlsRef.current?.setDrawTitlesMode(selectedPlane, newValue);
    };

    const handlePlaneDrawLabelsMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as EAxisPlaneDrawLabelsMode;
        setPlaneDrawLabelsMode(newValue);
        controlsRef.current?.setDrawLabelsMode(selectedPlane, newValue);
    };

    const handlePlaneIsVisible = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setPlaneIsVisible(newValue);
        controlsRef.current?.setIsPlaneVisible(selectedPlane, newValue);
    };

    const currentSettings = axisSettings[selectedAxis];

    return (
        <div className='sc-chart-wrapper sc-responsive-chart-wrapper'>
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                }}
            />
            <aside className='sc-responsive-controls'>
                {/* Axis Section */}
                <details className='sc-accordion' open={expanded === 'panel1'} onToggle={handlePanelToggle('panel1')}>
                    <summary className='sc-accordion-summary'>
                        <span>Axis Configuration</span>
                        <ExpandMoreIcon className='sc-accordion-chevron' />
                    </summary>
                    <div className='sc-accordion-details flex flex-col gap-2'>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Select Axis</span>
                            <select
                                aria-label='Select Axis'
                                className='sc-select flex-1 min-w-0'
                                value={selectedAxis}
                                onChange={handleAxisChange}
                            >
                                <option value='x'>X Axis</option>
                                <option value='y'>Y Axis</option>
                                <option value='z'>Z Axis</option>
                            </select>
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Orientation</span>
                            <select
                                className='sc-select flex-1 min-w-0'
                                aria-label='Label Orientation Mode'
                                value={currentSettings.labelOrientation}
                                onChange={handleLabelOrientationModeChange}
                            >
                                <option value={E3DLabelOrientationMode.Auto}>Auto</option>
                                <option value={E3DLabelOrientationMode.Horizontal}>Horizontal</option>
                            </select>
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Axis Font Size: {currentSettings.fontSize}</span>
                            <input
                                type='range'
                                className='sc-range flex-1 min-w-0'
                                step={1}
                                min={10}
                                max={30}
                                aria-label='Axis Font Size'
                                value={currentSettings.fontSize}
                                onChange={(event) => handleLabelFontSize(event.currentTarget.valueAsNumber)}
                            />
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Axis Title Offset: {currentSettings.titleOffset}</span>
                            <input
                                type='range'
                                className='sc-range flex-1 min-w-0'
                                step={1}
                                min={0}
                                max={100}
                                aria-label='Axis Title Offset'
                                value={currentSettings.titleOffset}
                                onChange={(event) => handleTitleOffset(event.currentTarget.valueAsNumber)}
                            />
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Tick Labels Offset: {currentSettings.tickLabelsOffset}</span>
                            <input
                                type='range'
                                className='sc-range flex-1 min-w-0'
                                step={1}
                                min={0}
                                max={100}
                                aria-label='Tick Labels Offset'
                                value={currentSettings.tickLabelsOffset}
                                onChange={(event) => handleTickLabelsOffset(event.currentTarget.valueAsNumber)}
                            />
                        </label>

                        <label className='sc-switch justify-between'>
                            <span className='flex-none'>Major Grid</span>
                            <input
                                type='checkbox'
                                checked={currentSettings.majorGridLines}
                                onChange={handleEnableMajorGridLines}
                            />
                        </label>
                        <label className='sc-switch justify-between'>
                            <span className='flex-none'>Minor Grid</span>
                            <input
                                type='checkbox'
                                checked={currentSettings.minorGridLines}
                                onChange={handleEnableMinorGridLines}
                            />
                        </label>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Axis Bands Color</span>
                            <input
                                type='color'
                                aria-label='Axis Bands Color'
                                value={formatHexForInput(currentSettings.bandsFill)}
                                onChange={handleBandsFillChange}
                                className='sc-input'
                            />
                        </label>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Major Grid Color</span>
                            <input
                                type='color'
                                aria-label='Major Grid Color'
                                value={formatHexForInput(currentSettings.majorGridColor)}
                                onChange={handleMajorGridLineColorChange}
                                className='sc-input'
                            />
                        </label>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Minor Grid Color</span>
                            <input
                                type='color'
                                aria-label='Minor Grid Color'
                                value={formatHexForInput(currentSettings.minorGridColor)}
                                onChange={handleMinorGridLineColorChange}
                                className='sc-input'
                            />
                        </label>
                    </div>
                </details>

                {/* Plane Section */}
                <details className='sc-accordion' open={expanded === 'panel2'} onToggle={handlePanelToggle('panel2')}>
                    <summary className='sc-accordion-summary'>
                        <span>Plane Configuration</span>
                        <ExpandMoreIcon className='sc-accordion-chevron' />
                    </summary>
                    <div className='sc-accordion-details flex flex-col gap-2'>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Select Plane</span>
                            <select
                                aria-label='Select Plane'
                                className='sc-select flex-1 min-w-0'
                                value={selectedPlane}
                                onChange={handlePlaneChange}
                            >
                                <option value='none'>None</option>
                                <option value='xy'>XY Plane</option>
                                <option value='zy'>ZY Plane</option>
                                <option value='zx'>ZX Plane</option>
                            </select>
                        </label>
                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Visibility</span>
                            <select
                                aria-label='Visibility Mode'
                                disabled={selectedPlane === 'none'}
                                className='sc-select flex-1 min-w-0'
                                value={visibilityMode}
                                onChange={handleVisibilityMode}
                            >
                                <option value='auto'>Auto</option>
                                <option value='negativeSide'>Negative Side</option>
                                <option value='positiveSide'>Positive Side</option>
                            </select>
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Draw Titles Mode</span>
                            <select
                                aria-label='Draw Titles Mode'
                                disabled={selectedPlane === 'none'}
                                className='sc-select flex-1 min-w-0'
                                value={planeDrawTitlesMode}
                                onChange={handlePlaneDrawTitlesMode}
                            >
                                <option value={EAxisPlaneDrawLabelsMode.Both}>Both</option>
                                <option value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</option>
                                <option value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</option>
                                <option value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </option>
                            </select>
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Draw Labels Mode</span>
                            <select
                                aria-label='Draw Labels Mode'
                                disabled={selectedPlane === 'none'}
                                className='sc-select flex-1 min-w-0'
                                value={planeDrawLabelsMode}
                                onChange={handlePlaneDrawLabelsMode}
                            >
                                <option value={EAxisPlaneDrawLabelsMode.Both}>Both</option>
                                <option value={EAxisPlaneDrawLabelsMode.Hidden}>Hidden</option>
                                <option value={EAxisPlaneDrawLabelsMode.LocalX}>LocalX</option>
                                <option value={EAxisPlaneDrawLabelsMode.LocalY}>LocalY </option>
                            </select>
                        </label>

                        <label className='sc-control justify-between'>
                            <span className='flex-none'>Is Visible</span>
                            <select
                                aria-label='Is Visible'
                                disabled={selectedPlane === 'none'}
                                className='sc-select flex-1 min-w-0'
                                value={planeIsVisible}
                                onChange={handlePlaneIsVisible}
                            >
                                <option value='true'>True</option>
                                <option value='false'>False</option>
                            </select>
                        </label>
                    </div>
                </details>
            </aside>
        </div>
    );
}
