import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function hasSession(
  storageKey: string,
  loginPath: string,
): boolean | ReturnType<Router['createUrlTree']> {
  const router = inject(Router);
  const storage = typeof window === 'undefined' ? null : window.localStorage;
  return storage?.getItem(storageKey) ? true : router.createUrlTree([loginPath]);
}

export const adminAuthGuard: CanActivateFn = () =>
  hasSession('digital-grades.admin.token', '/admin-login');

export const professorAuthGuard: CanActivateFn = () =>
  hasSession('digital-grades.professor.token', '/professor-login');

export const studentAuthGuard: CanActivateFn = () =>
  hasSession('digital-grades.student.token', '/student-login');
