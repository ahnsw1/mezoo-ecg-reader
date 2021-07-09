import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Res1Component } from './res1.component';

describe('Res1Component', () => {
  let component: Res1Component;
  let fixture: ComponentFixture<Res1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Res1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Res1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
