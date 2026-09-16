import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentApiService } from '../admin-shared/admin-api.service';
import { StudentSidebarComponent } from '../student-shared/student-sidebar';
import { StudentTopbarComponent } from '../student-shared/student-topbar';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [FormsModule, StudentSidebarComponent, StudentTopbarComponent],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.scss',
})
export class StudentProfileComponent {
  private readonly api = inject(StudentApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly account = this.readAccount();
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSaving = false;
  errorMessage = '';
  noticeMessage = '';

  changePassword(): void {
    this.errorMessage = '';
    this.noticeMessage = '';
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Complete all password fields.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Your new password must have at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Your new passwords do not match.';
      return;
    }
    this.isSaving = true;
    this.api.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isSaving = false;
        this.noticeMessage = response.message;
        this.changeDetector.detectChanges();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSaving = false;
        this.errorMessage =
          error.error?.message || 'Could not update your password. Please try again.';
        this.changeDetector.detectChanges();
      },
    });
  }

  private readAccount(): { name: string; email: string; initials: string } {
    try {
      const user = JSON.parse(localStorage.getItem('digital-grades.student.user') || 'null') as {
        name?: string;
        email?: string;
      } | null;
      const name = user?.name || 'Student';
      return {
        name,
        email: user?.email || '',
        initials:
          name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase() || 'S',
      };
    } catch {
      return { name: 'Student', email: '', initials: 'S' };
    }
  }
}
