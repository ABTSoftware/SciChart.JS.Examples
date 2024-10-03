import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AngularChartComponent } from "./angular-chart.component";

describe("AngularChartComponent", () => {
    let component: AngularChartComponent;
    let fixture: ComponentFixture<AngularChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AngularChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AngularChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
