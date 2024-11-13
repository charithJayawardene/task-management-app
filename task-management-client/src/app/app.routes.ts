import { Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { TasksListComponent } from './components/tasks/tasks-list/tasks-list.component';
import { TaskAuditComponent } from './components/tasks/task-audit/task-audit.component';
import { TasksDashboardComponent } from './components/tasks/tasks-dashboard/tasks-dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'tasks', component: TasksListComponent },
    { path: 'task-audit/:taskId', component: TaskAuditComponent },
    { path: 'dashboard', component: TasksDashboardComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
];
