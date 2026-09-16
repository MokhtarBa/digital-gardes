import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { AdminLoginComponent } from './admin-login/admin-login';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';
import { AcademicCyclesComponent } from './academic-cycles/academic-cycles';
import { AdminResourceComponent } from './admin-resource/admin-resource';
import { UsersComponent } from './users/users';
import { ClassesComponent } from './classes/classes';
import { GradeFormsComponent } from './grade-forms/grade-forms';
import { ReportsComponent } from './reports/reports';
import { SystemSettingsComponent } from './system-settings/system-settings';
import { ProfessorLoginComponent } from './professor-login/professor-login';
import { ProfessorDashboardComponent } from './professor-dashboard/professor-dashboard';
import { ProfessorClassesComponent } from './professor-classes/professor-classes';
import { ProfessorGradeFormsComponent } from './professor-grade-forms/professor-grade-forms';
import { ProfessorStudentsComponent } from './professor-students/professor-students';
import { StudentLoginComponent } from './student-login/student-login';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard';
import { StudentGradesComponent } from './student-grades/student-grades';
import { StudentClassesComponent } from './student-classes/student-classes';
import { StudentProfileComponent } from './student-profile/student-profile';
import { adminAuthGuard, professorAuthGuard, studentAuthGuard } from './app-auth.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'professor-login',
    component: ProfessorLoginComponent,
  },
  {
    path: 'professor-dashboard',
    component: ProfessorDashboardComponent,
    canActivate: [professorAuthGuard],
  },
  {
    path: 'professor-classes',
    component: ProfessorClassesComponent,
    canActivate: [professorAuthGuard],
  },
  {
    path: 'professor-grade-forms',
    component: ProfessorGradeFormsComponent,
    canActivate: [professorAuthGuard],
  },
  {
    path: 'professor-students',
    component: ProfessorStudentsComponent,
    canActivate: [professorAuthGuard],
  },
  {
    path: 'student-login',
    component: StudentLoginComponent,
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [studentAuthGuard],
  },
  {
    path: 'student-grades',
    component: StudentGradesComponent,
    canActivate: [studentAuthGuard],
  },
  {
    path: 'student-classes',
    component: StudentClassesComponent,
    canActivate: [studentAuthGuard],
  },
  {
    path: 'student-profile',
    component: StudentProfileComponent,
    canActivate: [studentAuthGuard],
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminAuthGuard],
  },

  {
    path: 'academic-cycles',
    component: AcademicCyclesComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'academic-years',
    component: AdminResourceComponent,
    data: { resource: 'years' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'classes',
    component: ClassesComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'professors',
    component: AdminResourceComponent,
    data: { resource: 'professors' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'students',
    component: AdminResourceComponent,
    data: { resource: 'students' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'subjects',
    component: AdminResourceComponent,
    data: { resource: 'subjects' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'grade-forms',
    component: GradeFormsComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'results',
    component: AdminResourceComponent,
    data: { resource: 'results' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'settings',
    component: AdminResourceComponent,
    data: { resource: 'settings' },
    canActivate: [adminAuthGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [adminAuthGuard],
  },
  {
    path: 'system-settings',
    component: SystemSettingsComponent,
    canActivate: [adminAuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
