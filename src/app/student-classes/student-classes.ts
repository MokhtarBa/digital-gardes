import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AdminClass, StudentApiService } from '../admin-shared/admin-api.service';
import { StudentSidebarComponent } from '../student-shared/student-sidebar';
import { StudentTopbarComponent } from '../student-shared/student-topbar';

@Component({
  selector: 'app-student-classes',
  standalone: true,
  imports: [StudentSidebarComponent, StudentTopbarComponent],
  templateUrl: './student-classes.html',
  styleUrl: './student-classes.scss',
})
export class StudentClassesComponent implements OnInit {
  private readonly api = inject(StudentApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  classes: AdminClass[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.api.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load your classes. Please sign in again and try once more.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
