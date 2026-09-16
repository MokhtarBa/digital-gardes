import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StudentLayoutService {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  toggleSidebar(): void {
    if (window.matchMedia('(max-width: 900px)').matches) this.mobileOpen.update((open) => !open);
    else this.collapsed.update((collapsed) => !collapsed);
  }

  closeMobileSidebar(): void {
    this.mobileOpen.set(false);
  }
}
