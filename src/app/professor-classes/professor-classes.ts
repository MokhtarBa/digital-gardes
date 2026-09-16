import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AdminClass, ProfessorApiService } from '../admin-shared/admin-api.service';
import { ProfessorSidebarComponent } from '../professor-shared/professor-sidebar';
import { ProfessorTopbarComponent } from '../professor-shared/professor-topbar';

@Component({
  selector: 'app-professor-classes',
  standalone: true,
  imports: [ProfessorSidebarComponent, ProfessorTopbarComponent],
  templateUrl: './professor-classes.html',
  styleUrl: './professor-classes.scss',
})
export class ProfessorClassesComponent implements OnInit {
  private readonly api = inject(ProfessorApiService);
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
        this.errorMessage =
          'Could not load your classes. Please sign in again and make sure the portal server is running.';
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
    });
  }
}
