import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProfessorLayoutService } from './professor-layout.service';

@Component({
  selector: 'app-professor-topbar',
  standalone: true,
  templateUrl: './professor-topbar.html',
  styleUrl: './professor-topbar.scss',
})
export class ProfessorTopbarComponent {
  readonly title = input('');
  readonly layout = inject(ProfessorLayoutService);
  private readonly router = inject(Router);
  profileOpen = false;
  readonly account = this.readAccount();

  signOut(): void {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    storage?.removeItem('digital-grades.professor.token');
    storage?.removeItem('digital-grades.professor.user');
    this.router.navigate(['/professor-login']);
  }

  private readAccount(): { name: string; email: string; initials: string } {
    try {
      const user = JSON.parse(
        (typeof window === 'undefined' ? null : window.localStorage)?.getItem(
          'digital-grades.professor.user',
        ) || 'null',
      ) as { name?: string; email?: string } | null;
      const name = user?.name || 'Professor';
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
            .toUpperCase() || 'P',
      };
    } catch {
      return { name: 'Professor', email: '', initials: 'P' };
    }
  }
}
