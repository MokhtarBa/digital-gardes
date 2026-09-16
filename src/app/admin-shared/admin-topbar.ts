import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLayoutService } from './admin-layout.service';
import { AdminApiService } from './admin-api.service';
import { Subscription } from 'rxjs';

interface AdminNotification {
  id: string | number;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  tone: 'blue' | 'green' | 'purple';
}

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss',
})
export class AdminTopbarComponent implements OnInit, OnDestroy {
  readonly title = input('');
  readonly layout = inject(AdminLayoutService);
  private readonly api = inject(AdminApiService);
  notificationsOpen = false;
  profileOpen = false;
  accountName = 'Admin User';
  accountEmail = 'admin@digitalgrades.com';
  accountInitials = 'AU';
  notifications: AdminNotification[] = [];
  private dataChangeSubscription?: Subscription;

  constructor(private readonly router: Router) {
    const storedUser = this.readStoredUser();
    if (storedUser) {
      this.accountName = storedUser.name;
      this.accountEmail = storedUser.email;
      this.accountInitials =
        storedUser.name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase() || 'AU';
    }
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadNotifications());
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
  }

  private loadNotifications(): void {
    this.api.getNotifications().subscribe({
      next: (activities) => {
        this.notifications = activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          detail: activity.detail,
          time: this.timeLabel(activity.createdAt),
          tone: activity.tone,
          unread: true,
        }));
      },
      error: () => {
        this.notifications = [];
      },
    });
  }

  get unreadCount(): number {
    return this.notifications.filter((notification) => notification.unread).length;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.profileOpen = false;
    if (this.notificationsOpen) this.loadNotifications();
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationsOpen = false;
  }

  markNotificationsRead(): void {
    this.notifications.forEach((notification) => {
      notification.unread = false;
    });
  }

  openSettings(): void {
    this.profileOpen = false;
    this.router.navigate(['/system-settings'], { replaceUrl: true });
  }

  signOut(): void {
    const storage = this.browserStorage();
    storage?.removeItem('digital-grades.admin.token');
    storage?.removeItem('digital-grades.admin.user');
    this.router.navigate(['/admin-login'], { replaceUrl: true });
  }

  private readStoredUser(): { name: string; email: string } | null {
    try {
      const value: unknown = JSON.parse(
        this.browserStorage()?.getItem('digital-grades.admin.user') || 'null',
      );
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Record<string, unknown>)['name'] === 'string' &&
        typeof (value as Record<string, unknown>)['email'] === 'string'
      ) {
        return {
          name: (value as Record<string, string>)['name'],
          email: (value as Record<string, string>)['email'],
        };
      }
    } catch {
      /* Use the default display name. */
    }
    return null;
  }

  private browserStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage;
  }

  private timeLabel(value: string): string {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
    if (minutes < 60) return `${Math.max(1, minutes)} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  }
}
