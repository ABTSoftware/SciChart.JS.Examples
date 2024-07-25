import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularExamplesComponent } from './angular-examples.component';

describe('VanillaExamplesComponent', () => {
  let component: AngularExamplesComponent;
  let fixture: ComponentFixture<AngularExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AngularExamplesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
