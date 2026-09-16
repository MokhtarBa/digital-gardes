import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    if (typeof window === 'undefined') return;

    let storage: Storage | null = null;
    try {
      storage = window.localStorage ?? null;
    } catch {
      return;
    }
    if (!storage) return;
    const backendVersion = 'spring-boot-v1';
    if (storage.getItem('digital-grades.backend') === backendVersion) return;

    // Node.js session tokens are intentionally not accepted by the Java API.
    // Clearing them once sends every portal through its normal secure login flow.
    for (const key of [
      'digital-grades.admin.token',
      'digital-grades.admin.user',
      'digital-grades.professor.token',
      'digital-grades.professor.user',
      'digital-grades.student.token',
      'digital-grades.student.user',
    ]) {
      storage.removeItem(key);
    }
    storage.setItem('digital-grades.backend', backendVersion);
  }
}
