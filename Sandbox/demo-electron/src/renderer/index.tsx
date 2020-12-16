import React from 'react';
import ReactDom from 'react-dom';
import FullScreenChart from './components/fullScreenChart';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import "./main.css"
import { ipcRenderer } from 'electron';

// Don't store the test of the license key in the renderer. Fetch it from main instead.
// An example can be found below.
SciChartSurface.setRuntimeLicenseKey(ipcRenderer.sendSync("getLicense"));

// <div class="mainDiv"> is placed at the root of the app. See main.css where it is given 100vh size
const mainElement = document.createElement('div');
mainElement.className = "mainDiv";
document.body.appendChild(mainElement);

ReactDom.render(
    <FullScreenChart />,
    mainElement
);
