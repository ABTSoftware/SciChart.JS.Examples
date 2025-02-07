// import { Component, OnInit } from '@angular/core';
import { SciChart3DSurface, SciChartSurface, StackedColumnCollection } from "scichart";
import { ActivatedRoute, Router } from "@angular/router";
import { EXAMPLES_PAGES } from "../../services/angularExample";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, NgZone, Injector } from "@angular/core";
import { getComponentByRoute } from "../../services/advancedExamples";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();
@Component({
    selector: "app-angular-chart",
    templateUrl: "./angular-chart.component.html",
    styleUrl: "./angular-chart.component.css",
})
export class AngularChartComponent {
    drawChart: any;
    isreload: boolean = false;
    html: boolean = false;
    onInitHandler: any;
    onDeleteHandler: any;
    initJustLineCharts: any;
    additinal: any = false;
    // appleLogoPath = applelogo;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private sanitizer: DomSanitizer,
        private viewContainerRef: ViewContainerRef
    ) {
        route.params.subscribe((res: any) => {
            let key = res.example;
            if (this.isreload) {
                this.reloadComponent();
            }
            this.drawChart = "";
            this.initChart(key);
        });
    }

    selector: any = "";
    initChart(key: string) {
        const currentExampleComponent = getComponentByRoute(key);
        if (currentExampleComponent) {
            this.html = true;
            this.viewContainerRef.createComponent<unknown>(currentExampleComponent);
        } else {
            const page = Object.values(EXAMPLES_PAGES).find((page) => page.path === key);
            if (page) {
                // @ts-ignore
                this.drawChart = page!.drawExample;
                this.html = false;
            } else {
                console.warn(`No Angular Component provided for ${key}`);
            }
        }

        // let exampleArr: any = EXAMPLES_PAGES;
        // Object.values(exampleArr).forEach((page: any) => {
        //     if (page.path == key) {
        //         this.drawChart = page.drawExample;
        //         // console.log("page.additinal", page.additinal)
        //         if (page.additinal) {
        //             this.html = true;
        //             this.additinal = page.id;

        //         }
        //         // if(page.json){
        //         //   this.html = true;
        //         //   this.fetchJsonData(page.json);
        //         // }
        //     }
        // });
        this.isreload = true;
    }
    reloadComponent() {
        const currentUrl = this.router.url;
        this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });
    }
}
