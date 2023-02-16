import { Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import * as React from 'react';

import { drawChart, TChartInfo } from './chartConfiguration';
import { EShowTooltipOptions, EExecuteWhen, CustomRolloverModifier } from './CustomRolloverModifier';

const divElementId = 'scichart-root';

function App() {
    const chartRef = React.useRef<TChartInfo>();

    React.useEffect(() => {
        const initChartPromise = drawChart(divElementId);

        initChartPromise.then((chart) => {
            chartRef.current = chart;
        });

        return () => {
            initChartPromise.then((chart: TChartInfo) => {
                chart.sciChartSurface.delete();
                chartRef.current = undefined;
            });
        };
    }, []);

    const [showTooltipOn, setShowTooltipOn] = React.useState<EShowTooltipOptions>(EShowTooltipOptions.Always);
    const [executeWhen, setExecuteWhen] = React.useState<EExecuteWhen>(EExecuteWhen.Always);

    const selectShowTooltipOn = (event: SelectChangeEvent<EShowTooltipOptions>) => {
        const { value } = event.target;
        setShowTooltipOn(value as EShowTooltipOptions);
        chartRef.current?.chartControls.handleShowTooltipOptionsChange(value);
    };

    const selectExecuteWhen = (event: SelectChangeEvent<EExecuteWhen>) => {
        const { value } = event.target;
        setExecuteWhen(value as EExecuteWhen);
        chartRef.current?.chartControls.handleExecuteWhenChange(value);
    };

    return (
        <div>
            <Typography variant='h4' gutterBottom>
                CustomRolloverModifier Example
            </Typography>
            <div style={{ width: 300 }}>
                <FormControl style={{ width: 150 }}>
                    <InputLabel id='show-tooltip-on-label'>ShowTooltipOn</InputLabel>
                    <Select
                        labelId='show-tooltip-on-label'
                        value={showTooltipOn}
                        label='Always'
                        onChange={selectShowTooltipOn}
                    >
                        <MenuItem value={EShowTooltipOptions.Always}>Always</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseOver}>MouseOver</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseHover}>MouseHover</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseLeftButtonDown}>MouseLeftButtonDown</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseMiddleButtonDown}>MouseMiddleButtonDown</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseRightButtonDown}>MouseRightButtonDown</MenuItem>
                        <MenuItem value={EShowTooltipOptions.MouseDoubleClick}>MouseDoubleClick</MenuItem>
                    </Select>
                </FormControl>
                <FormControl style={{ width: 150 }}>
                    <InputLabel id='show-tooltip-when-label'>ExecuteWhen</InputLabel>
                    <Select
                        labelId='show-tooltip-when-label'
                        value={executeWhen}
                        label='Always'
                        onChange={selectExecuteWhen}
                    >
                        <MenuItem value={EExecuteWhen.Always}>Always</MenuItem>
                        <MenuItem value={EExecuteWhen.Alt}>Alt</MenuItem>
                        <MenuItem value={EExecuteWhen.Ctrl}>Ctrl</MenuItem>
                        <MenuItem value={EExecuteWhen.Shift}>Shift</MenuItem>
                        <MenuItem value={EExecuteWhen.Meta}>Meta</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div id={divElementId} style={{ width: 900, maxWidth: 900, height: 600, maxHeight: 600 }} />
        </div>
    );
}

export default App;
