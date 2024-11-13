import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAuditComponent } from './task-audit.component';

describe('TaskAuditComponent', () => {
  let component: TaskAuditComponent;
  let fixture: ComponentFixture<TaskAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAuditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
