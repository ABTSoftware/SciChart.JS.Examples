import { Component } from '@angular/core';
import { SciChart3DSurface, SciChartSurface } from 'scichart';
import { ActivatedRoute, Router } from '@angular/router';
import { EXAMPLES_PAGES } from '../../services/angularExample';

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
@Component({
  selector: 'app-angular-chart',
  templateUrl: './angular-chart.component.html',
  styleUrl: './angular-chart.component.css'
})
export class AngularChartComponent {
  drawChart:any;
  isreload:boolean = false;
  
  constructor(private router: Router,private route: ActivatedRoute){
    
    route.params.subscribe((res:any)=>{
      let key = res.example;
      if(this.isreload){
        this.reloadComponent();
      }
      this.drawChart = '';
      this.initChart(key)
    })
    
  }
  checkChild(){
    const element = document.getElementById('chart') as HTMLDivElement;

if (element.childElementCount > 0) {
  return false;
} else {
  return true;
}
  }
  initChart(key:string){
    let exampleArr:any = EXAMPLES_PAGES;
    Object.values(exampleArr).forEach((page:any) => {
      if(page.path == key){
        this.drawChart = page.drawExample
      }
  });
    this.isreload = true;
  }
  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });
}
}
