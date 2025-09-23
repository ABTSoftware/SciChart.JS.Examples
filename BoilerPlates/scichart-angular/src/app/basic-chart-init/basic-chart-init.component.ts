import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScichartAngularComponent } from 'scichart-angular';
import { NumericAxis, SciChartSurface } from 'scichart';

@Component({
  selector: 'app-basic-chart-init',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './basic-chart-init.component.html',
  styleUrl: './basic-chart-init.component.css',
})
export class BasicChartInitComponent {
  public drawBasicChart = async (rootElement: string | HTMLDivElement) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // ...

    return { sciChartSurface };
  };
}
