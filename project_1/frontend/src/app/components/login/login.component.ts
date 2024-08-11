import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule],  // Import HttpClientModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('LoginComponent initialized');
  }

  onSubmit() {
    const user = { email: this.email, password: this.password };
    this.http.post('http://localhost:5000/api/login', user)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Login failed', error);
      });
  }
}
