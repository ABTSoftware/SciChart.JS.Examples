import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularExamplesComponent } from './components/angular-examples/angular-examples.component';
import { AngularChartComponent } from './components/angular-chart/angular-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ScichartAngularComponent } from 'scichart-angular';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import {AppLineChartComponent } from '../../../Examples/Charts2D/BasicChartTypes/LineChart/angularLineApp';
// import {StackeAppComponent} from '../.././../Examples/Charts2D/BasicChartTypes/StackedColumnChart/angularStackedColumnapp';
import {AppRealTimeMountainComponent} from '../../../Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/angularrealTimeMountainapp';
import {ChartComponent} from '../../../Examples/Charts2D/AxisLabelCustomization/ImageLabels/angularImageLabels';
import {ChartExampleComponent} from '../../../Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angularAnnotations';
@NgModule({
  declarations: [
    AppComponent,
    AngularExamplesComponent,
    AngularChartComponent,
    AppLineChartComponent,
    // StackeAppComponent,
    AppRealTimeMountainComponent,
    ChartComponent,
    ChartExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScichartAngularComponent,
    MatButtonToggleModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
