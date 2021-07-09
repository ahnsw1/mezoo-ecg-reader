import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdComponent } from './prd.component';

describe('PrdComponent', () => {
  let component: PrdComponent;
  let fixture: ComponentFixture<PrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
