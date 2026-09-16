import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AdminApiService, AdminGradeForm, AdminUser } from '../admin-shared/admin-api.service';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grade-forms',
  standalone: true,
  imports: [AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './grade-forms.html',
  styleUrl: './grade-forms.scss',
})
export class GradeFormsComponent implements OnInit, OnDestroy {
  private readonly api = inject(AdminApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private dataChangeSubscription?: Subscription;
  private refreshTimer?: number;
  notice = '';
  error = '';
  isLoading = true;
  approvingId: string | null = null;
  gradeForms: AdminGradeForm[] = [];
  users: AdminUser[] = [];
  viewingForm: AdminGradeForm | null = null;

  ngOnInit(): void {
    this.loadGradeForms();
    this.loadUsers();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadGradeForms());
    this.refreshTimer = window.setInterval(() => this.loadGradeForms(), 5000);
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
    if (this.refreshTimer !== undefined) window.clearInterval(this.refreshTimer);
  }

  private loadGradeForms(): void {
    this.isLoading = true;
    this.error = '';
    this.api.getGradeForms().subscribe({
      next: (forms) => {
        this.gradeForms = forms;
        this.isLoading = false;
        this.render();
      },
      error: () => {
        this.error =
          'Could not load grade forms. Sign in again and make sure the Java application is running.';
        this.isLoading = false;
        this.render();
      },
    });
  }

  get totalForms(): number {
    return this.gradeForms.length;
  }
  get pendingForms(): number {
    return this.gradeForms.filter((form) => form.status === 'Pending approval').length;
  }
  get approvedForms(): number {
    return this.gradeForms.filter((form) => form.status === 'Approved').length;
  }

  refresh(): void {
    this.loadGradeForms();
  }

  viewResults(gradeForm: AdminGradeForm): void {
    this.viewingForm = gradeForm;
  }

  closeResults(): void {
    this.viewingForm = null;
  }

  studentName(studentId: string): string {
    return this.users.find((user) => user.id === studentId)?.name || 'Removed student';
  }

  approveGradeForm(gradeForm: AdminGradeForm): void {
    if (gradeForm.status === 'Approved' || this.approvingId) return;
    this.approvingId = gradeForm.id;
    this.api.approveGradeForm(gradeForm.id).subscribe({
      next: (updated) => {
        this.gradeForms = this.gradeForms.map((form) => (form.id === updated.id ? updated : form));
        this.approvingId = null;
        this.notice = `“${updated.title}” was approved and is ready for grade publication.`;
        this.render();
      },
      error: (error: { error?: { message?: string } }) => {
        this.approvingId = null;
        this.error = error.error?.message || 'Could not approve this grade form.';
        this.render();
      },
    });
  }

  private render(): void {
    this.changeDetector.detectChanges();
  }

  private loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((user) => user.role === 'Student');
        this.render();
      },
      error: () => this.render(),
    });
  }
}
