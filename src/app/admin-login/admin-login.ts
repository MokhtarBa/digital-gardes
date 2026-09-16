import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../admin-shared/admin-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLoginComponent {
  // Form values
  email = '';
  password = '';

  // Page state
  showPassword = false;
  rememberMe = false;

  // Error message
  errorMessage = '';
  isSubmitting = false;

  private readonly api = inject(AdminApiService);

  constructor(private router: Router) {}

  // Show / hide password
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Admin login
  login(): void {
    this.errorMessage = '';

    // Check that fields are filled
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isSubmitting = true;
    this.api.login(this.email, this.password).subscribe({
      next: (session) => {
        localStorage.setItem('digital-grades.admin.token', session.token);
        localStorage.setItem('digital-grades.admin.user', JSON.stringify(session.user));
        this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
      },
      error: (error: { status?: number; name?: string }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.status === 0 || error.name === 'TimeoutError'
            ? 'The Java server did not respond. Start it with “npm run server:java”, then try again.'
            : 'Invalid admin email or password.';
      },
    });
  }

  // Return to normal login page
  goBackToLogin(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
