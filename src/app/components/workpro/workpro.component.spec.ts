import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkproComponent } from './workpro.component';

describe('WorkproComponent', () => {
  let component: WorkproComponent;
  let fixture: ComponentFixture<WorkproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
