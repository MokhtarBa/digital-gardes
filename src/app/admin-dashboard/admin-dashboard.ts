import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AdminActivity,
  AdminApiService,
  AdminDashboardSummary,
} from '../admin-shared/admin-api.service';
import { Subscription } from 'rxjs';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private readonly api = inject(AdminApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  summary: AdminDashboardSummary = {
    totalClasses: 0,
    activeClasses: 0,
    enrolledStudents: 0,
    professors: 0,
    students: 0,
    administrators: 0,
    submittedForms: 0,
    pendingForms: 0,
    approvedForms: 0,
    activities: [],
  };
  isLoading = true;
  private dataChangeSubscription?: Subscription;
  private readonly refreshWhenVisible = (): void => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      this.loadDashboard();
    }
  };
  private readonly refreshWhenUsersChange = (): void => this.loadDashboard();

  ngOnInit(): void {
    this.loadDashboard();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadDashboard());
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.refreshWhenVisible);
      window.addEventListener('digital-grades-users-changed', this.refreshWhenUsersChange);
    }
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.refreshWhenVisible);
      window.removeEventListener('digital-grades-users-changed', this.refreshWhenUsersChange);
    }
  }

  refresh(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.api.getDashboard().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }

  get activities(): AdminActivity[] {
    return this.summary.activities.slice(0, 2);
  }
}
