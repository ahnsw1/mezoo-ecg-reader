import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ecg1Component } from './ecg1.component';

describe('Ecg1Component', () => {
  let component: Ecg1Component;
  let fixture: ComponentFixture<Ecg1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ecg1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ecg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
