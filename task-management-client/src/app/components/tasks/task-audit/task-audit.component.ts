import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { Task } from '../../../models/Task';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-task-audit',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButton, MatHeaderCell, MatCell, MatHeaderRow, MatRow],
  templateUrl: './task-audit.component.html',
  styleUrl: './task-audit.component.scss'
})
export class TaskAuditComponent {
  taskId!: string;
  auditData: any[] = [];
  displayedColumns: string[] = ['title', 'changeType', 'userName', 'dateDid', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';
    this.fetchAuditData(this.taskId);
  }

  fetchAuditData(taskId: string): void {
    this.taskService.getTaskAudit(taskId).subscribe(
      (data) => {
        this.auditData = data;
      },
      (error) => {
        console.error('Error fetching audit data', error);
      }
    );
  }

  openDetailsDialog(task: any, log_name: string): void {
    this.dialog.open(TaskDetailsDialogComponent, {
      width: '500px',
      data: { task, log_name }
    });
  }
}
