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
import {ChartComponent} from '../../../../Examples/src/components/Examples/Charts2D/AxisLabelCustomization/ImageLabels/angular';
import {ChartExampleComponent} from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angular';
import {UsePointMarkers }  from '../../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers/angular';
import {TenorCurves3D} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/TenorCurves3D/angular';
import {CustomFilters} from '../../../../Examples/src/components/Examples/Charts2D/Filters/CustomFilters/angular'
import {StackeAppComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/angularStackedColumnapp'
import {InteractiveWaterfallChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/angular'
import {EditChartExampleComponent} from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/EditableAnnotations/angular';
import {Load1MillionPointsChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {RealtimePerformanceDemoComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/angular';
import {LiDAR3DPointCloudDemoComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/angulartest'

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
    InteractiveWaterfallChartComponent,
    EditChartExampleComponent,
    Load1MillionPointsChartComponent,
    RealtimePerformanceDemoComponent,
    LiDAR3DPointCloudDemoComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScichartAngularComponent,
    MatButtonToggleModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
