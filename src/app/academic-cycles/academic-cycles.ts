import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type CycleStatus = 'Active' | 'Upcoming' | 'Completed';

interface AcademicCycle {
  id: number;
  name: string;
  period: string;
  status: CycleStatus;
  classes: number;
}

@Component({
  selector: 'app-academic-cycles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './academic-cycles.html',
  styleUrl: './academic-cycles.scss',
})
export class AcademicCyclesComponent {
  sidebarOpen = false;
  showForm = false;
  newCycleName = '';
  newCyclePeriod = '';

  cycles: AcademicCycle[] = [
    { id: 1, name: '2026–2027', period: 'Sep 2026 – Jul 2027', status: 'Active', classes: 12 },
    { id: 2, name: '2025–2026', period: 'Sep 2025 – Jul 2026', status: 'Completed', classes: 11 },
    { id: 3, name: '2027–2028', period: 'Sep 2027 – Jul 2028', status: 'Upcoming', classes: 0 },
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  goTo(page: string): void {
    const routes: Record<string, string> = {
      dashboard: '/admin-dashboard',
      cycles: '/academic-cycles',
      years: '/academic-years',
      classes: '/classes',
      professors: '/professors',
      students: '/students',
      subjects: '/subjects',
      'grade-forms': '/grade-forms',
      results: '/results',
      settings: '/settings',
    };

    if (routes[page]) {
      this.router.navigate([routes[page]]);
    }

    this.sidebarOpen = false;
  }

  addCycle(): void {
    const name = this.newCycleName.trim();
    const period = this.newCyclePeriod.trim();

    if (!name || !period) {
      return;
    }

    this.cycles = [
      { id: Date.now(), name, period, status: 'Upcoming', classes: 0 },
      ...this.cycles,
    ];
    this.newCycleName = '';
    this.newCyclePeriod = '';
    this.showForm = false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }
}
