import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, tap, timeout } from 'rxjs';

export interface AdminSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Administrator';
    status: 'Active';
  };
}

export type AdminUserRole = 'Professor' | 'Student' | 'Administrator';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: 'Active';
}

export interface AdminClass {
  id: string;
  name: string;
  academicYear: string;
  professorId: string;
  professor: string;
  students: number;
  studentIds?: string[];
  status: 'Active';
}

export interface ProfessorStudent {
  id: string;
  name: string;
  email: string;
  classId: string;
  className: string;
}

export interface StudentGrade {
  studentId: string;
  score: number;
}

export interface AdminGradeForm {
  id: string;
  title: string;
  className: string;
  classId?: string | null;
  professorId?: string | null;
  professor: string;
  submitted: string;
  progress?: string;
  grades?: StudentGrade[];
  status: 'Draft' | 'Pending approval' | 'Approved';
}

export interface ProfessorSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Professor';
    status: 'Active';
  };
}

export interface ProfessorDashboardSummary {
  professor: ProfessorSession['user'];
  assignedClasses: AdminClass[];
  gradeForms: AdminGradeForm[];
  totalStudents: number;
  pendingForms: number;
  approvedForms: number;
}

export interface StudentSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Student';
    status: 'Active';
  };
}

export interface StudentGradeResult {
  id: string;
  title: string;
  classId: string;
  className: string;
  professor: string;
  submitted: string;
  score: number;
  maximumScore: number;
}

export interface StudentDashboardSummary {
  student: StudentSession['user'];
  classes: AdminClass[];
  grades: StudentGradeResult[];
  overallAverage: number | null;
}

export interface AdminActivity {
  id: string;
  title: string;
  detail: string;
  tone: 'blue' | 'green' | 'purple';
  createdAt: string;
}

export interface AdminDashboardSummary {
  totalClasses: number;
  activeClasses: number;
  enrolledStudents: number;
  professors: number;
  students: number;
  administrators: number;
  submittedForms: number;
  pendingForms: number;
  approvedForms: number;
  activities: AdminActivity[];
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';
  private readonly dataChangeSubject = new Subject<void>();
  readonly dataChanges = this.dataChangeSubject.asObservable();

  login(email: string, password: string) {
    return this.http
      .post<AdminSession>(`${this.baseUrl}/auth/admin/login`, { email, password })
      .pipe(timeout({ first: 5000 }));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http
      .patch<{ message: string }>(
        `${this.baseUrl}/auth/admin/password`,
        { currentPassword, newPassword },
        { headers: this.requestHeaders() },
      )
      .pipe(timeout({ first: 5000 }));
  }

  getUsers() {
    return this.http
      .get<AdminUser[]>(this.liveUrl('/users'), {
        headers: this.requestHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  createUser(user: { name: string; email: string; role: AdminUserRole; password: string }) {
    return this.http
      .post<AdminUser>(`${this.baseUrl}/users`, user, { headers: this.requestHeaders() })
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  setUserPassword(userId: string, password: string) {
    return this.http
      .patch<{ message: string }>(
        `${this.baseUrl}/users/${encodeURIComponent(userId)}/password`,
        { password },
        { headers: this.requestHeaders() },
      )
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  deleteUser(userId: string) {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/users/${encodeURIComponent(userId)}`, {
        headers: this.requestHeaders(),
      })
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  getClasses() {
    return this.http
      .get<AdminClass[]>(this.liveUrl('/classes'), { headers: this.requestHeaders() })
      .pipe(timeout({ first: 5000 }));
  }

  createClass(classRecord: {
    name: string;
    academicYear: string;
    professorId: string;
    studentIds: string[];
  }) {
    return this.http
      .post<AdminClass>(`${this.baseUrl}/classes`, classRecord, {
        headers: this.requestHeaders(),
      })
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  deleteClass(classId: string) {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/classes/${encodeURIComponent(classId)}`, {
        headers: this.requestHeaders(),
      })
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  updateClass(
    classId: string,
    classRecord: {
      name: string;
      academicYear: string;
      professorId: string;
      studentIds: string[];
    },
  ) {
    return this.http
      .patch<AdminClass>(`${this.baseUrl}/classes/${encodeURIComponent(classId)}`, classRecord, {
        headers: this.requestHeaders(),
      })
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  assignClassProfessor(classId: string, professorId: string) {
    return this.http
      .patch<AdminClass>(
        `${this.baseUrl}/classes/${encodeURIComponent(classId)}/professor`,
        { professorId },
        { headers: this.requestHeaders() },
      )
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  getGradeForms() {
    return this.http
      .get<AdminGradeForm[]>(this.liveUrl('/grade-forms'), {
        headers: this.requestHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  approveGradeForm(formId: string) {
    return this.http
      .patch<AdminGradeForm>(
        `${this.baseUrl}/grade-forms/${encodeURIComponent(formId)}/approve`,
        {},
        { headers: this.requestHeaders() },
      )
      .pipe(this.publishAfterChange(), timeout({ first: 5000 }));
  }

  getDashboard() {
    return this.http
      .get<AdminDashboardSummary>(this.liveUrl('/dashboard'), {
        headers: this.requestHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getNotifications() {
    return this.http
      .get<AdminActivity[]>(this.liveUrl('/notifications'), {
        headers: this.requestHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  private publishAfterChange<T>() {
    return tap<T>(() => this.dataChangeSubject.next());
  }

  private liveUrl(path: string): string {
    return `${this.baseUrl}${path}${path.includes('?') ? '&' : '?'}refresh=${Date.now()}`;
  }

  private requestHeaders(): HttpHeaders {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    const token = storage?.getItem('digital-grades.admin.token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}

@Injectable({ providedIn: 'root' })
export class ProfessorApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  login(email: string, password: string) {
    return this.http
      .post<ProfessorSession>(`${this.baseUrl}/auth/professor/login`, { email, password })
      .pipe(timeout({ first: 5000 }));
  }

  getDashboard() {
    return this.http
      .get<ProfessorDashboardSummary>(this.liveUrl('/professor/dashboard'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getClasses() {
    return this.http
      .get<AdminClass[]>(this.liveUrl('/professor/classes'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getGradeForms() {
    return this.http
      .get<AdminGradeForm[]>(this.liveUrl('/professor/grade-forms'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getStudents() {
    return this.http
      .get<ProfessorStudent[]>(this.liveUrl('/professor/students'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  createGradeFormDraft(form: { title: string; classId: string; grades: StudentGrade[] }) {
    return this.http
      .post<AdminGradeForm>(`${this.baseUrl}/professor/grade-forms`, form, {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  updateGradeFormDraft(
    formId: string,
    form: { title: string; classId: string; grades: StudentGrade[] },
  ) {
    return this.http
      .patch<AdminGradeForm>(
        `${this.baseUrl}/professor/grade-forms/${encodeURIComponent(formId)}`,
        form,
        { headers: this.authorizationHeaders() },
      )
      .pipe(timeout({ first: 5000 }));
  }

  submitGradeFormDraft(formId: string) {
    return this.http
      .patch<AdminGradeForm>(
        `${this.baseUrl}/professor/grade-forms/${encodeURIComponent(formId)}/submit`,
        {},
        { headers: this.authorizationHeaders() },
      )
      .pipe(timeout({ first: 5000 }));
  }

  private authorizationHeaders(): HttpHeaders {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    const token = storage?.getItem('digital-grades.professor.token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private liveUrl(path: string): string {
    return `${this.baseUrl}${path}?refresh=${Date.now()}`;
  }
}

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  login(email: string, password: string) {
    return this.http
      .post<StudentSession>(`${this.baseUrl}/auth/student/login`, { email, password })
      .pipe(timeout({ first: 5000 }));
  }

  getDashboard() {
    return this.http
      .get<StudentDashboardSummary>(this.liveUrl('/student/dashboard'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getClasses() {
    return this.http
      .get<AdminClass[]>(this.liveUrl('/student/classes'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  getGrades() {
    return this.http
      .get<StudentGradeResult[]>(this.liveUrl('/student/grades'), {
        headers: this.authorizationHeaders(),
      })
      .pipe(timeout({ first: 5000 }));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http
      .patch<{ message: string }>(
        `${this.baseUrl}/student/password`,
        { currentPassword, newPassword },
        { headers: this.authorizationHeaders() },
      )
      .pipe(timeout({ first: 5000 }));
  }

  private authorizationHeaders(): HttpHeaders {
    const storage = typeof window === 'undefined' ? null : window.localStorage;
    const token = storage?.getItem('digital-grades.student.token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  private liveUrl(path: string): string {
    return `${this.baseUrl}${path}?refresh=${Date.now()}`;
  }
}
