import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProfessorApiService, ProfessorDashboardSummary } from '../admin-shared/admin-api.service';
import { ProfessorSidebarComponent } from '../professor-shared/professor-sidebar';
import { ProfessorTopbarComponent } from '../professor-shared/professor-topbar';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [RouterLink, ProfessorSidebarComponent, ProfessorTopbarComponent],
  templateUrl: './professor-dashboard.html',
  styleUrl: './professor-dashboard.scss',
})
export class ProfessorDashboardComponent implements OnInit {
  private readonly api = inject(ProfessorApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  summary: ProfessorDashboardSummary = {
    professor: { id: '', name: 'Professor', email: '', role: 'Professor', status: 'Active' },
    assignedClasses: [],
    gradeForms: [],
    totalStudents: 0,
    pendingForms: 0,
    approvedForms: 0,
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
}
