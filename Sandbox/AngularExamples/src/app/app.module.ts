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
import {AppLineChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart/angularLineApp';
import {AppRealTimeMountainComponent} from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/angularrealTimeMountainapp';
import {ChartComponent} from '../../../../Examples/src/components/Examples/Charts2D/AxisLabelCustomization/ImageLabels/angularImageLabels';
import {ChartExampleComponent} from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angularAnnotations';
import { UsePointMarkers }  from '../../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers/angular';
import {TenorCurves3D} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/TenorCurves3D/angular';
import {CustomFilters} from '../../../../Examples/src/components/Examples/Charts2D/Filters/CustomFilters/angular'

// import {StackeAppComponent} from '../../../../Examples/Charts2D/BasicChartTypes/StackedColumnChart/angularStackedColumnapp';
import {StackeAppComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/angularStackedColumnapp'
// import {AppLineChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart/angularLineApp';
// import {UsePointMarkers} from '../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers';

import {InteractiveWaterfallChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/angular'

@NgModule({
  declarations: [
    AppComponent,
    AngularExamplesComponent,
    AngularChartComponent,
    AppLineChartComponent,
    StackeAppComponent,
    AppRealTimeMountainComponent,
    ChartComponent,
    ChartExampleComponent,
    UsePointMarkers,
    TenorCurves3D,
    CustomFilters,
    InteractiveWaterfallChartComponent
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
