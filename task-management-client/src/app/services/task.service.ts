import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Task } from '../models/Task';
import { TaskAudit } from '../models/TaskAudit';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient, private authService: AuthService) { }

  addTask(task: any): Observable<any> {
    const url = this.apiUrl + '/addTask';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post<any>(url, task, { headers });
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/updateTask/${task.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.put<Task>(url, task, { headers });
  }

  getTasks(): Observable<any> {
    const url = this.apiUrl + '/getTasks';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any>(url, { headers });
  }

  deleteTask(taskId: number): Observable<any> {
    const url = `${this.apiUrl}/deleteTask/${taskId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.delete<any>(url, { headers });
  }

  getTaskAudit(taskId: string): Observable<TaskAudit[]> {
    const url = `${this.apiUrl}/audit/${taskId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<TaskAudit[]>(url, { headers });
  }
}
