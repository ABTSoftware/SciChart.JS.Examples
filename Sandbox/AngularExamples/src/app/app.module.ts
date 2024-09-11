import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularExamplesComponent } from './components/angular-examples/angular-examples.component';
import { AngularChartComponent } from './components/angular-chart/angular-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ScichartAngularComponent } from 'scichart-angular';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule } from '@angular/forms';
import {MatCardModule } from '@angular/material/card';
import {MatButtonModule } from '@angular/material/button';
import {MatInputModule } from '@angular/material/input';
import {MatSelectModule } from '@angular/material/select';
import {AppLineChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart/angular';
import {AppRealTimeMountainComponent} from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/angular';
import {ChartComponent} from '../../../../Examples/src/components/Examples/Charts2D/AxisLabelCustomization/ImageLabels/angular';
import {ChartExampleComponent} from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angular';
import {UsePointMarkers }  from '../../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers/angular';
import {TenorCurves3D} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/TenorCurves3D/angular';
import {CustomFilters} from '../../../../Examples/src/components/Examples/Charts2D/Filters/CustomFilters/angular'
import {StackeAppComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/angular'
import {InteractiveWaterfallChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/angular'
import {EditChartExampleComponent} from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/EditableAnnotations/angular';
import {Load1MillionPointsChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/angular';
import {RealtimePerformanceDemoComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/angular';
import {LiDAR3DPointCloudDemoComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/angular';
import {UserAnnotatedStockChartComponent}  from '../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular'
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MultiPaneStockChartsComponent} from  '../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/angular'
import {AudioAnalyzerComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/angular'
import {VitalSignsMonitorComponent} from "../../../../Examples/src/components/Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/angular"
import {HeatmapChartComponent} from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/HeatmapChart/angular';
import {Load500By500ChartComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load500By500/angular';
import {PointLine3DChartComponent} from '../../../../Examples/src/components/Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/angular'
import {ReactiveFormsModule } from '@angular/forms';
import {HeatmapInteractionsComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/HeatmapInteractions/angular';
import {RealtimeBigDataShowcaseComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/WebsocketBigData/angular'
import {MatSliderModule} from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    LiDAR3DPointCloudDemoComponent,
    UserAnnotatedStockChartComponent,
    MultiPaneStockChartsComponent,
    HeatmapInteractionsComponent,
    VitalSignsMonitorComponent,
    AudioAnalyzerComponent,
    HeatmapChartComponent,
    Load500By500ChartComponent,
    PointLine3DChartComponent,
    RealtimeBigDataShowcaseComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScichartAngularComponent,
    MatButtonToggleModule,
    FormsModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSliderModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
