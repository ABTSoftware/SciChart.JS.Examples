import { Component } from '@angular/core';
// @ts-ignore
import { RouterOutlet } from '@angular/router';
import { ScichartAngularComponent } from 'scichart-angular';
// @ts-ignore
import { drawExample } from "../drawExample";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ScichartAngularComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'scichart-angular-app';

    drawExample = drawExample
}
