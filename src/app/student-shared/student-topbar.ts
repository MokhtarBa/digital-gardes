import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { StudentLayoutService } from './student-layout.service';

@Component({
  selector: 'app-student-topbar',
  standalone: true,
  templateUrl: './student-topbar.html',
  styleUrl: './student-topbar.scss',
})
export class StudentTopbarComponent {
  readonly title = input('');
  readonly layout = inject(StudentLayoutService);
  private readonly router = inject(Router);
  profileOpen = false;
  readonly account = this.readAccount();

  signOut(): void {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    storage?.removeItem('digital-grades.student.token');
    storage?.removeItem('digital-grades.student.user');
    this.router.navigate(['/student-login'], { replaceUrl: true });
  }

  private readAccount(): { name: string; email: string; initials: string } {
    try {
      const user = JSON.parse(
        (typeof window === 'undefined' ? null : window.localStorage)?.getItem(
          'digital-grades.student.user',
        ) || 'null',
      ) as { name?: string; email?: string } | null;
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
