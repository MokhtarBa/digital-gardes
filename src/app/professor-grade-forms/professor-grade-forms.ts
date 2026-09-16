import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminClass,
  AdminGradeForm,
  ProfessorApiService,
  ProfessorStudent,
  StudentGrade,
} from '../admin-shared/admin-api.service';
import { ProfessorSidebarComponent } from '../professor-shared/professor-sidebar';
import { ProfessorTopbarComponent } from '../professor-shared/professor-topbar';

@Component({
  selector: 'app-professor-grade-forms',
  standalone: true,
  imports: [FormsModule, ProfessorSidebarComponent, ProfessorTopbarComponent],
  templateUrl: './professor-grade-forms.html',
  styleUrl: './professor-grade-forms.scss',
})
export class ProfessorGradeFormsComponent implements OnInit {
  private readonly api = inject(ProfessorApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  classes: AdminClass[] = [];
  students: ProfessorStudent[] = [];
  forms: AdminGradeForm[] = [];
  title = '';
  classId = '';
  gradeByStudentId: Record<string, number | null> = {};
  editingFormId: string | null = null;
  viewingForm: AdminGradeForm | null = null;
  isLoading = true;
  isSubmitting = false;
  submittingFormId: string | null = null;
  errorMessage = '';
  noticeMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  get selectedClassStudents(): ProfessorStudent[] {
    return this.students.filter((student) => student.classId === this.classId);
  }

  prepareGrades(): void {
    const nextGrades: Record<string, number | null> = {};
    for (const student of this.selectedClassStudents) {
      nextGrades[student.id] = this.gradeByStudentId[student.id] ?? null;
    }
    this.gradeByStudentId = nextGrades;
  }

  saveDraft(submitForApproval = false): void {
    this.errorMessage = '';
    this.noticeMessage = '';
    const students = this.selectedClassStudents;
    const grades: StudentGrade[] = students
      .filter((student) => this.gradeByStudentId[student.id] !== null)
      .map((student) => ({
        studentId: student.id,
        score: Number(this.gradeByStudentId[student.id]),
      }));
    if (!this.title.trim() || !this.classId || !students.length) {
      this.errorMessage = 'Choose a class that has students and add a form title.';
      return;
    }
    if (
      grades.some((grade) => !Number.isFinite(grade.score) || grade.score < 0 || grade.score > 20)
    ) {
      this.errorMessage = 'Each entered grade must be between 0 and 20.';
      return;
    }
    this.isSubmitting = true;
    const formData = { title: this.title, classId: this.classId, grades };
    const request = this.editingFormId
      ? this.api.updateGradeFormDraft(this.editingFormId, formData)
      : this.api.createGradeFormDraft(formData);
    request.subscribe({
      next: (form) => {
        this.forms = this.editingFormId
          ? this.forms.map((item) => (item.id === form.id ? form : item))
          : [form, ...this.forms];
        this.resetForm();
        this.isSubmitting = false;
        if (submitForApproval) {
          this.submitDraft(form, true);
          return;
        }
        this.noticeMessage = 'Draft saved. You can edit it or submit it for administrator approval.';
        this.changeDetector.detectChanges();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message || 'Could not save the grade form. Please try again.';
        this.changeDetector.detectChanges();
      },
    });
  }

  editDraft(form: AdminGradeForm): void {
    this.errorMessage = '';
    this.noticeMessage = '';
    this.editingFormId = form.id;
    this.title = form.title;
    this.classId = form.classId || '';
    this.gradeByStudentId = Object.fromEntries(
      (form.grades || []).map((grade) => [grade.studentId, grade.score]),
    );
    this.prepareGrades();
    this.changeDetector.detectChanges();
  }

  cancelEdit(): void {
    this.resetForm();
    this.errorMessage = '';
    this.changeDetector.detectChanges();
  }

  submitDraft(form: AdminGradeForm, afterSave = false): void {
    this.errorMessage = '';
    this.noticeMessage = '';
    this.submittingFormId = form.id;
    this.api.submitGradeFormDraft(form.id).subscribe({
      next: (submittedForm) => {
        this.forms = this.forms.map((item) =>
          item.id === submittedForm.id ? submittedForm : item,
        );
        this.submittingFormId = null;
        this.noticeMessage = afterSave
          ? 'Grade form saved and submitted. It is now waiting for administrator approval.'
          : 'Grade form submitted. It is now waiting for administrator approval.';
        this.changeDetector.detectChanges();
      },
      error: (error: { error?: { message?: string } }) => {
        this.submittingFormId = null;
        this.errorMessage =
          error.error?.message || 'Could not submit this draft. Please try again.';
        this.changeDetector.detectChanges();
      },
    });
  }

  viewGrades(form: AdminGradeForm): void {
    this.viewingForm = form;
  }

  closeGradeHistory(): void {
    this.viewingForm = null;
  }

  studentName(studentId: string): string {
    return this.students.find((student) => student.id === studentId)?.name || 'Removed student';
  }

  private resetForm(): void {
    this.title = '';
    this.classId = '';
    this.gradeByStudentId = {};
    this.editingFormId = null;
  }

  private loadData(): void {
    this.api.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load your assigned classes.';
        this.changeDetector.detectChanges();
      },
    });
    this.api.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.prepareGrades();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load your assigned students.';
        this.changeDetector.detectChanges();
      },
    });
    this.api.getGradeForms().subscribe({
      next: (forms) => {
        this.forms = forms;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load your grade forms. Please sign in again.';
        this.changeDetector.detectChanges();
      },
    });
  }
}
