import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule, FormsModule],  // Import HttpClientModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('RegisterComponent initialized');
  }

  onSubmit() {
    const user = { name: this.name, email: this.email, password: this.password };
    this.http.post('http://localhost:5000/api/register', user)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
      }, error => {
        console.error('Registration failed', error);
      });
  }
}
