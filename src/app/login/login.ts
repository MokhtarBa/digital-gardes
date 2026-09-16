import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  accountType: 'professor' | 'student' = 'professor';
  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  errorMessage = '';

  constructor(private readonly router: Router) {}

  selectAccount(accountType: 'professor' | 'student'): void {
    this.accountType = accountType;
    if (accountType === 'professor')
      this.router.navigate(['/professor-login'], { replaceUrl: true });
    else this.router.navigate(['/student-login'], { replaceUrl: true });
  }

  openAdminLogin(event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/admin-login'], { replaceUrl: true });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
    }
  }
}
