import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/Task';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TaskService } from '../../../services/task.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-update-task-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.scss'
})
export class UpdateTaskDialogComponent {
  taskForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, users: User[] }
  ) {
    this.taskForm = this.fb.group({
      title: [this.data.task?.title || '', Validators.required],
      description: [this.data.task?.description || '', Validators.required],
      status: [this.data.task?.status || '', Validators.required],
      priority: [this.data.task?.priority || '', Validators.required],
      dueDate: [this.data.task?.due_date || '', Validators.required],
      assignUserId: [this.data.task?.assign_user_id || null]
    });

    this.users = this.data.users;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = { ...this.data.task, ...this.taskForm.value };
      updatedTask.id = this.data.task.id;
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          const task = response;
          const assignName = this.users.find(user => user.id === task.assign_user_id)?.name;
          if (assignName) {
            task.assignName = assignName;
          }
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating task', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
