# Angular Sci Chart Demo Standalone app 

## Step 1: Adding SciChart to your AngularExamples Application

## Step 1.1 
You can add the Angular example in two ways, depending on whether you have additional HTML and TypeScript logic along with the drawExample for SciChart, or if you only have the drawExample.

## Step 1.2 Adding Additional HTML and TypeScript Logic
Here, you would provide instructions for integrating the additional HTML and TypeScript logic along with the drawExample.

To include your chart details, update the ExampleStrings.ts file. In this file, you need to specify the following properties: urlAnnotationsAreEasy, titleAnnotationsAreEasy, urlAnnotationsDocumentation, and urlTitleAnnotationsDocumentation.

// Annotations are easy
urlAnnotationsAreEasy: `chart-annotations`,
titleAnnotationsAreEasy: (frameworkName: TFrameworkName) => `${frameworkName} Chart Annotations`,
urlAnnotationsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html`,
urlTitleAnnotationsDocumentation: `The specific page for the SciChart.js Annotations documentation will help you get started.`,

After that, in angularExample.ts, add the id, path, title, and additional properties for the chart annotations:

chart2D_chartAnnotations_AnnotationsAreEasy: {
    id: "chart2D_chartAnnotations_AnnotationsAreEasy",
    title: ExampleStrings.titleAnnotationsAreEasy(framework),
    path: ExampleStrings.urlAnnotationsAreEasy,
    additional: true,  // Indicates that this chart has additional HTML and TypeScript logic
},

## Step : Creating the Angular Component
Next, create an angular.ts file in the following directory:

Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular

Import this file into app.module.ts:

import { UserAnnotatedStockChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular';

The angular.ts file should look like this:
import { Component } from '@angular/core';

@Component({
    selector: 'app-user-annotated-stock-chart',
    template: `
    <style>
        .toolbar-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
            background: ${appTheme.DarkIndigo};
            align-items: center;
        }
        /* Additional styles here */
    </style>
    <div class="chart-wrapper">
        <div class="flex-outer-container">
            <div class="toolbar-row">
                <mat-button-toggle-group (change)="onChartModeChange($event)" [value]="chartMode" appearance="outline" color="primary">
                    <mat-button-toggle value="pan">Pan</mat-button-toggle>
                    <mat-button-toggle value="line">Lines</mat-button-toggle>
                    <mat-button-toggle value="marker">Markers</mat-button-toggle>
                </mat-button-toggle-group>
                <mat-form-field>
                    <input matInput placeholder="Save As" [(ngModel)]="name" (ngModelChange)="onNameChanged($event)">
                </mat-form-field>
                <button mat-button (click)="saveChart()">Save</button>
                <mat-form-field>
                    <mat-select placeholder="Load From" [(ngModel)]="selectedChart" (selectionChange)="onSelectionChanged($event)">
                        <mat-option *ngFor="let name of getChartNames()" [value]="name">{{ name }}</mat-option>
                    </mat-select>
                </mat-form-field>
                <button mat-button (click)="loadChart()">Load</button>
                <button mat-button (click)="resetChart()">Reset</button>
            </div>
            <div>
                <scichart-angular
                    [initChart]="drawExample"
                    (onInit)="onInit($event)"
                    style="flex: 1; flex-basis: 50%;">
                </scichart-angular>
            </div>
        </div>
    </div>
    `,
})
export class UserAnnotatedStockChartComponent {
    
}

Integrating the Component

/home/cnadmin/cn/SciChart.JS.Examples/Sandbox/AngularExamples/src/app/components/angular-chart/angular-chart.component.html

selector: 'app-user-annotated-stock-chart',

 Add the following code snippet:
    <ng-container *ngIf="additional=='chart2D_createStockCharts_SharedChart'">
        <app-user-annotated-stock-chart></app-user-annotated-stock-chart>
    </ng-container>


## Step 1.3 only have the drawExample

Here, outline how to implement just the drawExample.

To include your chart details, update the ExampleStrings.ts file. In this file, you need to specify the following properties: urlBandChart, urlTitleBandChart, titleBandChart, pageTitleBandChart,urlTitleBandChartDocumentation, and urlBandChartDocumentation.

For example, for a Band chart:

    // Band chart
    urlBandChart: `band-chart`,
    urlTitleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart example`,
    titleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart`,
    pageTitleBandChart: (frameworkName: TFrameworkName) =>
    `${frameworkName} Band Chart | JavaScript Charts | View Examples`,
    urlBandChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Band%20Series%20type.html`,
    urlTitleBandChartDocumentation: `This specific page in the JavaScript Band Chart documentation will help you to get started`,

    After that, in angularExample.ts, add the id, path, title, and drawExample. Pay special attention to the bandSeriesChartExampleInfo.drawExample file. First, import the drawExample from the path starting with the Examples folder:


    import * as bandSeriesChartExampleInfo from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart/drawExample" ;

    chart2D_basicCharts_BandSeriesChart: {
            id: "chart2D_basicCharts_BandSeriesChart",
            path: ExampleStrings.urlBandChart,
            title: ExampleStrings.titleBandChart(framework),
            drawExample: bandSeriesChartExampleInfo.drawExample
        },


If you haven't already done so, add SciChart.js to your Angular application.
Additionally, we recommend using the official [Angular wrapper for SciChart](https://www.npmjs.com/package/scichart-angular)

```Angular
npm install scichart scichart-angular
```

## Step 2: Wasm file deployment

Loading required WASM dependencies

SciChart.js requires additional WASM modules to work (scichart2d.wasm + scichart2d.data for instantiating SciChartSurface and scichart3d.wasm + scichart3d.data for SciChart3DSurface).

SciChartSurface.configure({
    wasmUrl: "/scichart2d.wasm",
    dataUrl: "/scichart2d.data"
});

SciChart3DSurface.configure({
    wasmUrl: "/scichart3d.wasm",
    dataUrl: "/scichart3d.data"
});

# Running the example

```
npm install
npm start
```

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
