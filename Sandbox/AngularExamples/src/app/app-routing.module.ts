import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AngularChartComponent } from "./components/angular-chart/angular-chart.component";

const routes: Routes = [{ path: "angularDemo/:example", component: AngularChartComponent }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
