import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfessorLayoutService } from './professor-layout.service';

@Component({
  selector: 'app-professor-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './professor-sidebar.html',
  styleUrl: './professor-sidebar.scss',
})
export class ProfessorSidebarComponent {
  readonly layout = inject(ProfessorLayoutService);
  private readonly router = inject(Router);

  signOut(): void {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    storage?.removeItem('digital-grades.professor.token');
    storage?.removeItem('digital-grades.professor.user');
    this.layout.closeMobileSidebar();
    this.router.navigate(['/professor-login'], { replaceUrl: true });
  }
}
