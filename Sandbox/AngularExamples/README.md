# Angular SciChart Demo Standalone app

## Usage

Prerequisite: install dependencies in [../../Examples](../../Examples) folder.

Then, in current folder (`Sandbox/AngularExamples`) run the following:

```
npm ci --legacy-peer-deps
npm start
```

---

## Adding SciChart to your AngularExamples Application

You can add the Angular example in two ways, depending on whether [you have additional HTML and TypeScript logic along with the drawExample](#adding-custom-logic-in-component), or [if you only have the drawExample](#primitive-example).

---

### Primitive example

**(only has logic in drawExample)**
To include your chart details, update the ExampleStrings.ts file. In this file, you need to specify the following properties: urlBandChart, urlTitleBandChart, titleBandChart, pageTitleBandChart,urlTitleBandChartDocumentation, and urlBandChartDocumentation.

For example, for a Band chart:

```ts
    // Band chart
    urlBandChart: `band-chart`,
    urlTitleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart example`,
    titleBandChart: (frameworkName: TFrameworkName) => `${frameworkName} Band Chart`,
    pageTitleBandChart: (frameworkName: TFrameworkName) =>
    `${frameworkName} Band Chart | JavaScript Charts | View Examples`,
    urlBandChartDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Band%20Series%20type.html`,
    urlTitleBandChartDocumentation: `This specific page in the JavaScript Band Chart documentation will help you to get started`,
```

    After that, in angularExample.ts, add the id, path, title, and drawExample. Pay special attention to the bandSeriesChartExampleInfo.drawExample file. First, import the drawExample from the path starting with the Examples folder:

```ts
    import * as bandSeriesChartExampleInfo from "../../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/BandSeriesChart/drawExample" ;

    chart2D_basicCharts_BandSeriesChart: {
        id: "chart2D_basicCharts_BandSeriesChart",
        path: ExampleStrings.urlBandChart,
        title: ExampleStrings.titleBandChart(framework),
        drawExample: bandSeriesChartExampleInfo.drawExample
    },
```

That should be enough for the example to work.

---

### Adding Custom Logic in Component

#### Add reference in AngularExamples

To include your chart details, update the ExampleStrings.ts file. In this file, you need to specify the following properties: urlAnnotationsAreEasy, titleAnnotationsAreEasy, urlAnnotationsDocumentation, and urlTitleAnnotationsDocumentation.

```ts
// Annotations are easy
urlAnnotationsAreEasy: `chart-annotations`,
titleAnnotationsAreEasy: (frameworkName: TFrameworkName) => `${frameworkName} Chart Annotations`,
urlAnnotationsDocumentation: `https://www.scichart.com/documentation/js/current/webframe.html#The%20Annotations%20API%20Overview.html`,
urlTitleAnnotationsDocumentation: `The specific page for the SciChart.js Annotations documentation will help you get started.`,
```

After that, in angularExample.ts, add the id, path, title, and additional properties for the chart annotations:

```ts
chart2D_chartAnnotations_AnnotationsAreEasy: {
    id: "chart2D_chartAnnotations_AnnotationsAreEasy",
    title: ExampleStrings.titleAnnotationsAreEasy(framework),
    path: ExampleStrings.urlAnnotationsAreEasy,
    additional: true,  // Indicates that this chart has additional HTML and TypeScript logic
},
```

#### Creating the Angular Component

Next, create an `angular.ts` file in the following directory:

`Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular`

Import this file into `app.module.ts`:

```ts
import { UserAnnotatedStockChartComponent } from "../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular";
```

The `angular.ts` file should look like this:

```ts
import { Component } from "@angular/core";

@Component({
  selector: "app-user-annotated-stock-chart",
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
            <input matInput placeholder="Save As" [(ngModel)]="name" (ngModelChange)="onNameChanged($event)" />
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
          <scichart-angular [initChart]="drawExample" (onInit)="onInit($event)" style="flex: 1; flex-basis: 50%;"> </scichart-angular>
        </div>
      </div>
    </div>
  `,
})
export class UserAnnotatedStockChartComponent {}
```

#### Integrating the Component

`SciChart.JS.Examples/Sandbox/AngularExamples/src/app/components/angular-chart/angular-chart.component.html`

`selector: 'app-user-annotated-stock-chart',`

Add the following code snippet:

```ts
   <ng-container *ngIf="additional=='chart2D_createStockCharts_SharedChart'">
       <app-user-annotated-stock-chart></app-user-annotated-stock-chart>
   </ng-container>
```
