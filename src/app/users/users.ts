import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminUser, AdminUserRole } from '../admin-shared/admin-api.service';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit, OnDestroy {
  private readonly api = inject(AdminApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private dataChangeSubscription?: Subscription;

  search = '';
  showForm = false;
  fullName = '';
  email = '';
  role: AdminUserRole = 'Professor';
  initialPassword = '';
  passwordUserId: string | null = null;
  replacementPassword = '';
  formError = '';
  passwordError = '';
  notice = '';
  isLoading = true;
  isSubmitting = false;
  isSettingPassword = false;
  deletingUserId: string | null = null;
  users: AdminUser[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadUsers());
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
  }

  get filteredUsers(): AdminUser[] {
    const query = this.search.trim().toLowerCase();
    return query
      ? this.users.filter((user) =>
          `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query),
        )
      : this.users;
  }

  get professorTotal(): number {
    return this.users.filter((user) => user.role === 'Professor').length;
  }
  get studentTotal(): number {
    return this.users.filter((user) => user.role === 'Student').length;
  }
  get administratorTotal(): number {
    return this.users.filter((user) => user.role === 'Administrator').length;
  }
  get selectedAccount(): AdminUser | undefined {
    return this.users.find((user) => user.id === this.passwordUserId);
  }

  isCurrentAdministrator(user: AdminUser): boolean {
    try {
      const savedUser = JSON.parse(
        (typeof window === 'undefined' ? null : window.localStorage)?.getItem(
          'digital-grades.admin.user',
        ) || 'null',
      ) as { id?: string } | null;
      return savedUser?.id === user.id;
    } catch {
      return false;
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.formError = '';
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        this.render();
      },
      error: (error: { status?: number; error?: { message?: string } }) => {
        this.isLoading = false;
        this.formError = this.apiError(
          error,
          'Could not load users. Make sure npm run server:java is running.',
        );
        this.render();
      },
    });
  }

  openForm(): void {
    this.showForm = true;
    this.formError = '';
    this.notice = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.fullName = '';
    this.email = '';
    this.role = 'Professor';
    this.initialPassword = '';
    this.formError = '';
  }

  openPasswordForm(user: AdminUser): void {
    this.passwordUserId = user.id;
    this.replacementPassword = '';
    this.passwordError = '';
    this.notice = '';
  }

  closePasswordForm(): void {
    this.passwordUserId = null;
    this.replacementPassword = '';
    this.passwordError = '';
  }

  addUser(): void {
    const name = this.fullName.trim();
    const email = this.email.trim().toLowerCase();
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.formError = 'Enter a full name and valid email address.';
      return;
    }
    if (this.initialPassword.trim().length < 6) {
      this.formError = `Give the ${this.role.toLowerCase()} a password with at least 6 characters.`;
      return;
    }

    this.isSubmitting = true;
    this.api
      .createUser({ name, email, role: this.role, password: this.initialPassword })
      .subscribe({
        next: (user) => {
          this.users = [user, ...this.users];
          this.isSubmitting = false;
          this.closeForm();
          this.notice = `“${user.name}” was added as a ${user.role.toLowerCase()}.`;
          window.dispatchEvent(new Event('digital-grades-users-changed'));
          this.render();
        },
        error: (error: { status?: number; error?: { message?: string } }) => {
          this.isSubmitting = false;
          this.formError = this.apiError(
            error,
            'Could not create this user. Make sure the backend is running.',
          );
          this.render();
        },
      });
  }

  saveUserPassword(): void {
    const account = this.selectedAccount;
    const password = this.replacementPassword.trim();
    if (!account || password.length < 6) {
      this.passwordError = 'Use at least 6 characters for the account password.';
      return;
    }

    this.isSettingPassword = true;
    this.api.setUserPassword(account.id, password).subscribe({
      next: () => {
        this.isSettingPassword = false;
        this.notice = `A new password was set for ${account.name}.`;
        this.closePasswordForm();
        this.render();
      },
      error: (error: { status?: number; error?: { message?: string } }) => {
        this.isSettingPassword = false;
        this.passwordError = this.apiError(
          error,
          'Could not update this password. Make sure the backend is running.',
        );
        this.render();
      },
    });
  }

  deleteUser(user: AdminUser): void {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      `Delete ${user.name}'s ${user.role.toLowerCase()} account? This cannot be undone.`,
    );
    if (!confirmed) return;

    this.notice = '';
    this.formError = '';
    this.deletingUserId = user.id;
    this.api.deleteUser(user.id).subscribe({
      next: ({ message }) => {
        this.users = this.users.filter((item) => item.id !== user.id);
        this.deletingUserId = null;
        this.notice = message;
        window.dispatchEvent(new Event('digital-grades-users-changed'));
        this.render();
      },
      error: (error: { status?: number; error?: { message?: string } }) => {
        this.deletingUserId = null;
        this.formError = this.apiError(error, 'Could not delete this user. Please try again.');
        this.render();
      },
    });
  }

  private apiError(
    error: { status?: number; error?: { message?: string } },
    fallback: string,
  ): string {
    if (error.status === 401) {
      return 'Your administrator session expired. Please sign in to the Admin portal again, then return here.';
    }
    return error.error?.message || fallback;
  }

  private render(): void {
    this.changeDetector.detectChanges();
  }
}
