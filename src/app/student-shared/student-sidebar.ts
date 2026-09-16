import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StudentLayoutService } from './student-layout.service';

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './student-sidebar.html',
  styleUrl: './student-sidebar.scss',
})
export class StudentSidebarComponent {
  readonly layout = inject(StudentLayoutService);
  private readonly router = inject(Router);

  signOut(): void {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    storage?.removeItem('digital-grades.student.token');
    storage?.removeItem('digital-grades.student.user');
    this.layout.closeMobileSidebar();
    this.router.navigate(['/student-login'], { replaceUrl: true });
  }
}
