import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StudentApiService, StudentDashboardSummary } from '../admin-shared/admin-api.service';
import { StudentSidebarComponent } from '../student-shared/student-sidebar';
import { StudentTopbarComponent } from '../student-shared/student-topbar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterLink, StudentSidebarComponent, StudentTopbarComponent],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboardComponent implements OnInit {
  private readonly api = inject(StudentApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  summary: StudentDashboardSummary = {
    student: { id: '', name: 'Student', email: '', role: 'Student', status: 'Active' },
    classes: [],
    grades: [],
    overallAverage: null,
  };
  isLoading = true;

  ngOnInit(): void {
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

  resultLabel(score: number): string {
    return score >= 16
      ? 'Excellent'
      : score >= 14
        ? 'Very good'
        : score >= 10
          ? 'Passed'
          : 'Needs support';
  }
}
