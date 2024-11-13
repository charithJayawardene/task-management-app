import { Component } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/Task';

@Component({
  selector: 'app-tasks-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './tasks-dashboard.component.html',
  styleUrl: './tasks-dashboard.component.scss'
})
export class TasksDashboardComponent {

  metrics = { totalTasks: 0, dueToday: 0, overdueTasks: 0 };

  tasks: Task[] = [];
  totalTasks: number = 0;
  dueToday: number = 0;
  overdueTasks: number = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.calculateMetrics();
  }

  calculateMetrics() {
    this.taskService.getTasks().subscribe(
      (response) => {
        this.tasks = response.tasks;
        const today = new Date();
        this.totalTasks = this.tasks.length;
        this.dueToday = this.tasks.filter(task => new Date(task.due_date).toDateString() === today.toDateString()).length;
        this.overdueTasks = this.tasks.filter(task => new Date(task.due_date) < today && task.status !== "Completed").length;
      },
      (error) => {
        console.log('Error in fetch tasks', error);
      }
    );
  }
}
