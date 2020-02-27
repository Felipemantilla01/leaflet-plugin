import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkproMgmtComponent } from './workpro-mgmt.component';

describe('WorkproMgmtComponent', () => {
  let component: WorkproMgmtComponent;
  let fixture: ComponentFixture<WorkproMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkproMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkproMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
