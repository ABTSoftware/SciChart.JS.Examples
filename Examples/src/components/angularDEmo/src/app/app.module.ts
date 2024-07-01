import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularExamplesComponent } from './components/angular-examples/angular-examples.component';
import { AngularChartComponent } from './components/angular-chart/angular-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ScichartAngularComponent } from 'scichart-angular';

@NgModule({
  declarations: [
    AppComponent,
    AngularExamplesComponent,
    AngularChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ScichartAngularComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
