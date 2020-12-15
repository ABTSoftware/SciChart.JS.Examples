import React from 'react';
import ReactDom from 'react-dom';
import FullScreenChart from './components/fullScreenChart';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import "./main.css"

SciChartSurface.setRuntimeLicenseKey('YOUR_SCICHART_LICENSE_KEY_HERE');

// <div class="mainDiv"> is placed at the root of the app. See main.css where it is given 100vh size
const mainElement = document.createElement('div');
mainElement.className = "mainDiv";
document.body.appendChild(mainElement);

ReactDom.render(
    <FullScreenChart />,
    mainElement
);
