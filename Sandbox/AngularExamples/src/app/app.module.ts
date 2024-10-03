import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularExamplesComponent } from './components/angular-examples/angular-examples.component';
import { AngularChartComponent } from './components/angular-chart/angular-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ScichartAngularComponent } from 'scichart-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent as AppLineChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/LineChart/angular';
import { AppComponent as AppRealTimeMountainComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/RealTimeMountainChart/angular';
import { AppComponent as ChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/AxisLabelCustomization/ImageLabels/angular';
import { AppComponent as ChartExampleComponent } from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/AnnotationsAreEasy/angular';
import { AppComponent as UsePointMarkers } from '../../../../Examples/src/components/Examples/Charts2D/StylingAndTheming/UsePointMarkers/angular';
import { AppComponent as TenorCurves3D } from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/TenorCurves3D/angular';
import { AppComponent as CustomFilters } from '../../../../Examples/src/components/Examples/Charts2D/Filters/CustomFilters/angular';
import { AppComponent as StackedColumnChart } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/StackedColumnChart/angular';
import { AppComponent as InteractiveWaterfallChartComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/InteractiveWaterfallChart/angular';
import { AppComponent as EditChartExampleComponent } from '../../../../Examples/src/components/Examples/Charts2D/ChartAnnotations/EditableAnnotations/angular';
import { AppComponent as Load1MillionPointsChartComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load1MillionPoints/angular';
import { AppComponent as RealtimePerformanceDemoComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/RealtimePerformanceDemo/angular';
import { AppComponent as LiDAR3DPointCloudDemoComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/LiDAR3DPointCloudDemo/angular';
import { AppComponent as UserAnnotatedStockChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/UserAnnotatedStockChart/angular';
import { AppComponent as MultiPaneStockChartsComponent } from '../../../../Examples/src/components/Examples/Charts2D/CreateStockCharts/MultiPaneStockCharts/angular';
import { AppComponent as AudioAnalyzerComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/ScientificCharts/AudioAnalyzer/angular';
import { AppComponent as VitalSignsMonitorComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/angular';
import { AppComponent as HeatmapChartComponent } from '../../../../Examples/src/components/Examples/Charts2D/BasicChartTypes/HeatmapChart/angular';
import { AppComponent as Load500By500ChartComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/PerformanceDemos/Load500By500/angular';
import { AppComponent as PointLine3DChartComponent } from '../../../../Examples/src/components/Examples/Charts3D/Basic3DChartTypes/PointLine3DChart/angular';
import { AppComponent as HeatmapInteractionsComponent } from '../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/HeatmapInteractions/angular';
// import {RealtimeBigDataShowcaseComponent} from '../../../../Examples/src/components/Examples/FeaturedApps/ShowCases/WebsocketBigData/angular'

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AngularExamplesComponent,
    AngularChartComponent,
    AppLineChartComponent,
    StackedColumnChart,
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
    // RealtimeBigDataShowcaseComponent,
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
    MatSliderModule,
  ],
  exports: [ScichartAngularComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
