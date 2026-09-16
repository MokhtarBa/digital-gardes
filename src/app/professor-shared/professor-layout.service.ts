import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfessorLayoutService {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      this.mobileOpen.update((open) => !open);
      return;
    }
    this.collapsed.update((collapsed) => !collapsed);
    if (typeof document !== 'undefined')
      document.documentElement.style.setProperty(
        '--professor-sidebar-width',
        this.collapsed() ? '76px' : '230px',
      );
  }

  closeMobileSidebar(): void {
    this.mobileOpen.set(false);
  }
}
