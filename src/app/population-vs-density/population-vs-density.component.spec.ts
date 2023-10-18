import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationVsDensityComponent } from './population-vs-density.component';

describe('PopulationVsDensityComponent', () => {
  let component: PopulationVsDensityComponent;
  let fixture: ComponentFixture<PopulationVsDensityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopulationVsDensityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationVsDensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
