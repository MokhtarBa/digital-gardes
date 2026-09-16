import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      this.mobileOpen.update((open) => !open);
      return;
    }
    this.collapsed.update((collapsed) => !collapsed);
    this.applyDesktopWidth();
  }

  closeMobileSidebar(): void {
    this.mobileOpen.set(false);
  }

  private applyDesktopWidth(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty(
      '--admin-sidebar-width',
      this.collapsed() ? '76px' : '230px',
    );
  }
}
