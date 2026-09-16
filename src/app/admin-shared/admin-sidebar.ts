import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminLayoutService } from './admin-layout.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebarComponent {
  readonly layout = inject(AdminLayoutService);
  private readonly router = inject(Router);

  signOut(): void {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    storage?.removeItem('digital-grades.admin.token');
    storage?.removeItem('digital-grades.admin.user');
    this.layout.closeMobileSidebar();
    this.router.navigate(['/admin-login'], { replaceUrl: true });
  }
}
