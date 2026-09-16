import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentApiService } from '../admin-shared/admin-api.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student-login.html',
  styleUrl: './student-login.scss',
})
export class StudentLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  isSubmitting = false;
  errorMessage = '';
  private readonly api = inject(StudentApiService);
  private readonly router = inject(Router);

  login(): void {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }
    this.isSubmitting = true;
    this.api.login(this.email, this.password).subscribe({
      next: (session) => {
        localStorage.setItem('digital-grades.student.token', session.token);
        localStorage.setItem('digital-grades.student.user', JSON.stringify(session.user));
        this.router.navigate(['/student-dashboard'], { replaceUrl: true });
      },
      error: (error: { status?: number; name?: string; error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.status === 0 || error.name === 'TimeoutError'
            ? 'The portal server did not respond. Start it with “npm run server:java”, then try again.'
            : error.error?.message || 'Invalid student email or password.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
