import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { StudentApiService, StudentGradeResult } from '../admin-shared/admin-api.service';
import { StudentSidebarComponent } from '../student-shared/student-sidebar';
import { StudentTopbarComponent } from '../student-shared/student-topbar';

@Component({
  selector: 'app-student-grades',
  standalone: true,
  imports: [StudentSidebarComponent, StudentTopbarComponent],
  templateUrl: './student-grades.html',
  styleUrl: './student-grades.scss',
})
export class StudentGradesComponent implements OnInit {
  private readonly api = inject(StudentApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  grades: StudentGradeResult[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.api.getGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load your grades. Please sign in again and try once more.';
        this.changeDetector.detectChanges();
      },
    });
  }

  gradeLabel(score: number): string {
    return score >= 16
      ? 'Excellent'
      : score >= 14
        ? 'Very good'
        : score >= 10
          ? 'Passed'
          : 'Needs support';
  }
}
