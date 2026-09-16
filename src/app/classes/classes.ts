import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminClass, AdminUser } from '../admin-shared/admin-api.service';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class ClassesComponent implements OnInit, OnDestroy {
  private readonly api = inject(AdminApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private dataChangeSubscription?: Subscription;

  showForm = false;
  editingClassId: string | null = null;
  className = '';
  academicYear = '';
  professor = '';
  selectedStudentIds: string[] = [];
  showAssignmentForm = false;
  selectedClassId: string | null = null;
  assignedProfessor = '';
  formError = '';
  assignmentError = '';
  notice = '';
  isLoading = true;
  isSaving = false;
  isAssigning = false;
  deletingClassId: string | null = null;
  classes: AdminClass[] = [];
  professors: AdminUser[] = [];
  students: AdminUser[] = [];
  private classesLoaded = false;
  private usersLoaded = false;

  ngOnInit(): void {
    this.loadData();
    this.dataChangeSubscription = this.api.dataChanges.subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription?.unsubscribe();
  }

  get professorNames(): string[] {
    return this.professors.map((professor) => professor.name).sort((a, b) => a.localeCompare(b));
  }
  get availableStudents(): AdminUser[] {
    return this.students;
  }

  isStudentSelected(studentId: string): boolean {
    return this.selectedStudentIds.includes(studentId);
  }

  toggleStudent(studentId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedStudentIds = checked
      ? [...new Set([...this.selectedStudentIds, studentId])]
      : this.selectedStudentIds.filter((id) => id !== studentId);
  }

  get totalClasses(): number {
    return this.classes.length;
  }
  get activeClasses(): number {
    return this.classes.filter((item) => item.status === 'Active').length;
  }
  get enrolledStudents(): number {
    return this.classes.reduce((total, item) => total + item.students, 0);
  }

  loadData(): void {
    this.isLoading = true;
    this.classesLoaded = false;
    this.usersLoaded = false;
    this.formError = '';
    this.api.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.classesLoaded = true;
        this.checkLoaded();
        this.render();
      },
      error: () => {
        this.formError =
          'Could not load classes. Sign in again and make sure npm run server:java is running.';
        this.isLoading = false;
        this.render();
      },
    });
    this.api.getUsers().subscribe({
      next: (users) => {
        this.professors = users.filter((user) => user.role === 'Professor');
        this.students = users.filter((user) => user.role === 'Student');
        this.usersLoaded = true;
        this.checkLoaded();
        this.render();
      },
      error: () => {
        this.isLoading = false;
        this.render();
      },
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingClassId = null;
    this.formError = '';
    this.notice = '';
  }
  closeForm(): void {
    this.showForm = false;
    this.editingClassId = null;
    this.className = '';
    this.academicYear = '';
    this.professor = '';
    this.selectedStudentIds = [];
    this.formError = '';
  }

  openEditForm(classRecord: AdminClass): void {
    this.showForm = true;
    this.editingClassId = classRecord.id;
    this.className = classRecord.name;
    this.academicYear = classRecord.academicYear;
    this.professor = classRecord.professor;
    this.selectedStudentIds = [...(classRecord.studentIds || [])];
    this.formError = '';
    this.notice = '';
  }

  openAssignmentForm(): void {
    const firstClass = this.classes[0];
    this.showAssignmentForm = true;
    this.selectedClassId = firstClass?.id ?? null;
    this.assignedProfessor = firstClass?.professor ?? '';
    this.assignmentError = '';
    this.notice = '';
  }

  closeAssignmentForm(): void {
    this.showAssignmentForm = false;
    this.selectedClassId = null;
    this.assignedProfessor = '';
    this.assignmentError = '';
  }

  syncAssignedProfessor(): void {
    this.assignedProfessor =
      this.classes.find((item) => item.id === this.selectedClassId)?.professor ?? '';
    this.assignmentError = '';
  }

  addClass(): void {
    const name = this.className.trim();
    const academicYear = this.academicYear.trim();
    const professor = this.findProfessor(this.professor);
    if (!name || !academicYear || !professor || !this.selectedStudentIds.length) {
      this.formError =
        'Choose an existing professor and at least one existing student, then enter the class name and academic year.';
      return;
    }

    this.isSaving = true;
    const classData = {
      name,
      academicYear,
      professorId: professor.id,
      studentIds: this.selectedStudentIds,
    };
    const request = this.editingClassId
      ? this.api.updateClass(this.editingClassId, classData)
      : this.api.createClass(classData);
    request.subscribe({
      next: (classRecord) => {
        const edited = this.editingClassId !== null;
        this.classes = edited
          ? this.classes.map((item) => (item.id === classRecord.id ? classRecord : item))
          : [classRecord, ...this.classes];
        this.isSaving = false;
        this.notice = edited
          ? `“${classRecord.name}” was updated.`
          : `“${classRecord.name}” was created and is now active.`;
        this.closeForm();
        this.render();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSaving = false;
        this.formError =
          error.error?.message || 'Could not save the class. Make sure the backend is running.';
        this.render();
      },
    });
  }

  assignProfessor(): void {
    const classRecord = this.classes.find((item) => item.id === this.selectedClassId);
    const professor = this.findProfessor(this.assignedProfessor);
    if (!classRecord || !professor) {
      this.assignmentError = 'Choose a class and an existing professor.';
      return;
    }

    this.isAssigning = true;
    this.api.assignClassProfessor(classRecord.id, professor.id).subscribe({
      next: (updated) => {
        this.classes = this.classes.map((item) => (item.id === updated.id ? updated : item));
        this.isAssigning = false;
        this.notice = `${updated.professor} is now assigned to “${updated.name}”.`;
        this.closeAssignmentForm();
        this.render();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isAssigning = false;
        this.assignmentError = error.error?.message || 'Could not assign this professor.';
        this.render();
      },
    });
  }

  deleteClass(classRecord: AdminClass): void {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      `Delete “${classRecord.name}”? Any grade forms for this class will also be deleted.`,
    );
    if (!confirmed) return;

    this.notice = '';
    this.formError = '';
    this.deletingClassId = classRecord.id;
    this.api.deleteClass(classRecord.id).subscribe({
      next: ({ message }) => {
        this.classes = this.classes.filter((item) => item.id !== classRecord.id);
        this.deletingClassId = null;
        this.notice = message;
        this.render();
      },
      error: (error: { error?: { message?: string } }) => {
        this.deletingClassId = null;
        this.formError = error.error?.message || 'Could not delete this class. Please try again.';
        this.render();
      },
    });
  }

  private findProfessor(name: string): AdminUser | undefined {
    return this.professors.find(
      (professor) => professor.name.toLowerCase() === name.trim().toLowerCase(),
    );
  }

  private checkLoaded(): void {
    if (this.classesLoaded && this.usersLoaded) this.isLoading = false;
  }

  private render(): void {
    this.changeDetector.detectChanges();
  }
}
