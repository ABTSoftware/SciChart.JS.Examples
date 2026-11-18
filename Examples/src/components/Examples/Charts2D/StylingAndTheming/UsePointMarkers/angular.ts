import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { createExample } from "./createExample";

@Component({
    standalone: true,
    selector: "app-root",
    template: `<div #chart style="width: 100%; height: 100%;"></div>`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
    @ViewChild("chart", { static: true }) chart!: ElementRef<HTMLDivElement>;
    private demo?: ReturnType<typeof createExample>;

    ngAfterViewInit() {
        this.demo = createExample(this.chart.nativeElement);
    }

    ngOnDestroy() {
        this.demo?.dispose();
    }
}
