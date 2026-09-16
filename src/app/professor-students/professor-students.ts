import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProfessorApiService, ProfessorStudent } from '../admin-shared/admin-api.service';
import { ProfessorSidebarComponent } from '../professor-shared/professor-sidebar';
import { ProfessorTopbarComponent } from '../professor-shared/professor-topbar';

@Component({
  selector: 'app-professor-students',
  standalone: true,
  imports: [ProfessorSidebarComponent, ProfessorTopbarComponent],
  templateUrl: './professor-students.html',
  styleUrl: './professor-students.scss',
})
export class ProfessorStudentsComponent implements OnInit {
  private readonly api = inject(ProfessorApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  students: ProfessorStudent[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.api.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load your students. Please sign in again and try once more.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
