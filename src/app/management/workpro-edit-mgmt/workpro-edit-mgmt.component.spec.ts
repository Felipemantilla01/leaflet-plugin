import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkproEditMgmtComponent } from './workpro-edit-mgmt.component';

describe('WorkproEditMgmtComponent', () => {
  let component: WorkproEditMgmtComponent;
  let fixture: ComponentFixture<WorkproEditMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkproEditMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkproEditMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
