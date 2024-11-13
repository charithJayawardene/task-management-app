import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-add-task-dialog',
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
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})
export class AddTaskDialogComponent {
  taskForm: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: User[] }
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
      assignUserId: [null]
    });

    this.users = this.data.users;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      let newTask = this.taskForm.value;
      this.taskService.addTask(newTask).subscribe(
        (response) => {
          const task = response.task;
          const assignName = this.users.find(user => user.id === task.assign_user_id)?.name;
          task.assignName = assignName;
          this.dialogRef.close(task);
        },
        (error) => {
          console.error('Error adding task', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
