import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../models/Task';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { TaskService } from '../../../services/task.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/User';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusFilter: string = '';
  priorityFilter: string = '';
  sortOption: string = '';
  users: User[] = [];

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    forkJoin([this.userService.getUsers(), this.taskService.getTasks()]).subscribe(
      (responses) => {
        this.users = responses[0].users;
        this.tasks = responses[1].tasks;
        this.assignUserNames();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  assignUserNames(): void {
    this.tasks.forEach(task => {
      const assignedUser = this.users.find(user => user.id === task.assign_user_id);
      if (assignedUser) {
        task.assignName = assignedUser.name;
      }
    });
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter(task =>
      (this.statusFilter ? task.status === this.statusFilter : true) &&
      (this.priorityFilter ? task.priority === this.priorityFilter : true)
    );
  }

  applySorting(): void {
    switch (this.sortOption) {
      case 'dueDateAsc':
        this.filteredTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
        break;
      case 'dueDateDesc':
        this.filteredTasks.sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime());
        break;
      case 'priorityAsc':
        this.filteredTasks.sort((a, b) => this.comparePriority(a.priority, b.priority));
        break;
      case 'priorityDesc':
        this.filteredTasks.sort((a, b) => this.comparePriority(b.priority, a.priority));
        break;
      default:
        this.filteredTasks.sort((a, b) => a.id - b.id);
        break;
    }
  }

  comparePriority(priorityA: 'Low' | 'Medium' | 'High', priorityB: 'Low' | 'Medium' | 'High'): number {
    const priorityLevels: { [key in 'Low' | 'Medium' | 'High']: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
    return priorityLevels[priorityA] - priorityLevels[priorityB];
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      data: { users: this.users }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasks.push(result);
        this.applyFilter();
        this.toastr.success('Task created successfully!', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      data: { task, users: this.users }
    });

    dialogRef.afterClosed().subscribe(updatedTask => {
      if (updatedTask) {
        this.tasks = this.tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );
        this.applyFilter();
        this.toastr.success('Task updated successfully!', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    });
  }

  deleteTask(taskId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe(
          (response) => {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.applyFilter();
            this.toastr.success('Task deleted successfully!', 'Success', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        );
      }
    });
  }

  viewAudit(taskId: number): void {
    this.router.navigate(['/task-audit', taskId]);
  }

}
