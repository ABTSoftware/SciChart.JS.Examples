import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChart } from './my-chart';

describe('MyChart', () => {
  let component: MyChart;
  let fixture: ComponentFixture<MyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyChart],
    }).compileComponents();

    fixture = TestBed.createComponent(MyChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
