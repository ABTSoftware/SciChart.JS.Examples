import { Component } from '@angular/core';
// @ts-ignore
import { drawExample } from "./drawExample";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent {
    title = 'scichart-angular-app';

    drawExample = drawExample
}
