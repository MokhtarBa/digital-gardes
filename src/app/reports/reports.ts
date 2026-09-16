import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AdminApiService, AdminDashboardSummary } from '../admin-shared/admin-api.service';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent implements OnInit, OnDestroy {
  private readonly api = inject(AdminApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private dataChangeSubscription?: Subscription;
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
  error = '';

  ngOnInit(): void {
    this.loadReport();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadReport());
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
  }

  loadReport(): void {
    this.isLoading = true;
    this.error = '';
    this.api.getDashboard().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.isLoading = false;
        this.render();
      },
      error: () => {
        this.error =
          'Could not load the live report. Sign in again and make sure npm run server:java is running.';
        this.isLoading = false;
        this.render();
      },
    });
  }

  get approvalRate(): number {
    return this.summary.submittedForms
      ? Math.round((this.summary.approvedForms / this.summary.submittedForms) * 100)
      : 0;
  }

  get largestMetric(): number {
    return Math.max(
      1,
      this.summary.totalClasses,
      this.summary.activeClasses,
      this.summary.submittedForms,
      this.summary.approvedForms,
    );
  }

  percent(value: number): number {
    return Math.max(8, Math.round((value / this.largestMetric) * 100));
  }

  private render(): void {
    this.changeDetector.detectChanges();
  }
}
