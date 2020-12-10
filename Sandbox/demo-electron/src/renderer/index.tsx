import React from 'react';
import ReactDom from 'react-dom';
import BasicChart from './components/basicChart';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import "./main.css"

SciChartSurface.setRuntimeLicenseKey('YOUR_SCICHART_LICENSE_KEY_HERE');

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

ReactDom.render(
    <BasicChart />,
    mainElement
);
