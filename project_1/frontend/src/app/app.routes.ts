import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect to /login by default
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Add additional routes here as needed
];
