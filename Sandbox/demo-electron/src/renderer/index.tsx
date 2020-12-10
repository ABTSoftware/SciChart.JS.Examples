import React from 'react';
import ReactDom from 'react-dom';
import BasicChart from './components/basicChart';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';

SciChartSurface.setRuntimeLicenseKey('trial key');

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

ReactDom.render(
    <BasicChart />,
    mainElement
);
