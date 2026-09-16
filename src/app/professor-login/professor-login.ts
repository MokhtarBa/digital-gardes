import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfessorApiService } from '../admin-shared/admin-api.service';

@Component({
  selector: 'app-professor-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './professor-login.html',
  styleUrl: './professor-login.scss',
})
export class ProfessorLoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  isSubmitting = false;
  errorMessage = '';
  private readonly api = inject(ProfessorApiService);
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
        localStorage.setItem('digital-grades.professor.token', session.token);
        localStorage.setItem('digital-grades.professor.user', JSON.stringify(session.user));
        this.router.navigate(['/professor-dashboard'], { replaceUrl: true });
      },
      error: (error: { status?: number; name?: string; error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.status === 0 || error.name === 'TimeoutError'
            ? 'The portal server did not respond. Start it with “npm run server:java”, then try again.'
            : error.error?.message || 'Invalid professor email or password.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
