import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDataComponent } from './p-data.component';

describe('PDataComponent', () => {
  let component: PDataComponent;
  let fixture: ComponentFixture<PDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
