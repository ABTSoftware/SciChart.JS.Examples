import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ScichartAngularComponent } from 'scichart-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, ScichartAngularComponent, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
