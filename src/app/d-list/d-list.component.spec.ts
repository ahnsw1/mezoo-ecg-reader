import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DListComponent } from './d-list.component';

describe('DListComponent', () => {
  let component: DListComponent;
  let fixture: ComponentFixture<DListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
