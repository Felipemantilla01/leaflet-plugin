import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkproEditableComponent } from './workpro-editable.component';

describe('WorkproEditableComponent', () => {
  let component: WorkproEditableComponent;
  let fixture: ComponentFixture<WorkproEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkproEditableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkproEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
