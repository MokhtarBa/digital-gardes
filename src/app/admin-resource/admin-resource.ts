import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

type ResourceKey =
  | 'years'
  | 'classes'
  | 'professors'
  | 'students'
  | 'subjects'
  | 'gradeForms'
  | 'results'
  | 'settings';

interface ResourceRow {
  id: number;
  [key: string]: string | number;
}

interface ResourceConfig {
  title: string;
  eyebrow: string;
  description: string;
  action: string;
  singular: string;
  columns: { key: string; label: string }[];
  rows: ResourceRow[];
}

const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  years: {
    title: 'Academic Years',
    eyebrow: 'ACADEMIC',
    description: 'Configure the study years that belong to each academic cycle.',
    action: 'Add academic year',
    singular: 'academic year',
    columns: [
      { key: 'name', label: 'Academic year' },
      { key: 'cycle', label: 'Cycle' },
      { key: 'classes', label: 'Classes' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, name: 'Licence Year 1', cycle: '2026–2027', classes: 4, status: 'Active' },
      { id: 2, name: 'Licence Year 2', cycle: '2026–2027', classes: 4, status: 'Active' },
      { id: 3, name: 'Master Year 1', cycle: '2026–2027', classes: 2, status: 'Active' },
    ],
  },
  classes: {
    title: 'Classes',
    eyebrow: 'ACADEMIC',
    description: 'Create and manage the classes available in your academic years.',
    action: 'Add class',
    singular: 'class',
    columns: [
      { key: 'name', label: 'Class' },
      { key: 'year', label: 'Academic year' },
      { key: 'students', label: 'Students' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, name: 'Licence 1 – A', year: 'Licence Year 1', students: 32, status: 'Active' },
      { id: 2, name: 'Licence 2 – B', year: 'Licence Year 2', students: 28, status: 'Active' },
      { id: 3, name: 'Master 1 – A', year: 'Master Year 1', students: 18, status: 'Active' },
    ],
  },
  professors: {
    title: 'Professors',
    eyebrow: 'PEOPLE',
    description: 'Manage professor accounts, subjects, and class assignments.',
    action: 'Add professor',
    singular: 'professor',
    columns: [
      { key: 'name', label: 'Professor' },
      { key: 'email', label: 'Email' },
      { key: 'subject', label: 'Main subject' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      {
        id: 1,
        name: 'Dr. Aïssatou Diallo',
        email: 'a.diallo@digitalgrades.com',
        subject: 'Data Structures',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Prof. Mamadou Sarr',
        email: 'm.sarr@digitalgrades.com',
        subject: 'Algorithms',
        status: 'Active',
      },
      {
        id: 3,
        name: 'Dr. Fatou Ndiaye',
        email: 'f.ndiaye@digitalgrades.com',
        subject: 'Databases',
        status: 'Active',
      },
    ],
  },
  students: {
    title: 'Students',
    eyebrow: 'PEOPLE',
    description: 'View and organize student accounts by their assigned class.',
    action: 'Add student',
    singular: 'student',
    columns: [
      { key: 'name', label: 'Student' },
      { key: 'email', label: 'Email' },
      { key: 'class', label: 'Class' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      {
        id: 1,
        name: 'Amadou Ba',
        email: 'amadou.ba@student.edu',
        class: 'Licence 1 – A',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Mariama Sow',
        email: 'mariama.sow@student.edu',
        class: 'Licence 2 – B',
        status: 'Active',
      },
      {
        id: 3,
        name: 'Ibrahima Fall',
        email: 'ibrahima.fall@student.edu',
        class: 'Master 1 – A',
        status: 'Active',
      },
    ],
  },
  subjects: {
    title: 'Subjects',
    eyebrow: 'ACADEMIC',
    description: 'Manage subjects, coefficients, and their class assignments.',
    action: 'Add subject',
    singular: 'subject',
    columns: [
      { key: 'name', label: 'Subject' },
      { key: 'code', label: 'Code' },
      { key: 'coefficient', label: 'Coefficient' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, name: 'Data Structures', code: 'CS201', coefficient: 3, status: 'Active' },
      { id: 2, name: 'Algorithms', code: 'CS202', coefficient: 4, status: 'Active' },
      { id: 3, name: 'Database Systems', code: 'CS203', coefficient: 3, status: 'Active' },
    ],
  },
  gradeForms: {
    title: 'Grade Forms',
    eyebrow: 'GRADES',
    description: 'Create grade forms for exams, evaluations, and practical work.',
    action: 'Create grade form',
    singular: 'grade form',
    columns: [
      { key: 'name', label: 'Grade form' },
      { key: 'class', label: 'Class' },
      { key: 'period', label: 'Period' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 1, name: 'Midterm Exam', class: 'Licence 2 – B', period: 'Semester 1', status: 'Open' },
      {
        id: 2,
        name: 'Project Evaluation',
        class: 'Master 1 – A',
        period: 'Semester 1',
        status: 'Open',
      },
      {
        id: 3,
        name: 'Final Exam',
        class: 'Licence 1 – A',
        period: 'Semester 1',
        status: 'Upcoming',
      },
    ],
  },
  results: {
    title: 'Results',
    eyebrow: 'GRADES',
    description: 'Review result publications and monitor academic performance.',
    action: 'Publish results',
    singular: 'result set',
    columns: [
      { key: 'name', label: 'Result set' },
      { key: 'class', label: 'Class' },
      { key: 'average', label: 'Average' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      {
        id: 1,
        name: 'Semester 1 Results',
        class: 'Licence 1 – A',
        average: '14.2 / 20',
        status: 'Published',
      },
      {
        id: 2,
        name: 'Midterm Results',
        class: 'Licence 2 – B',
        average: '13.8 / 20',
        status: 'Published',
      },
      {
        id: 3,
        name: 'Project Results',
        class: 'Master 1 – A',
        average: '15.1 / 20',
        status: 'Draft',
      },
    ],
  },
  settings: {
    title: 'Settings',
    eyebrow: 'SYSTEM',
    description: 'Review the essential settings for your Digital Grades workspace.',
    action: 'Add setting',
    singular: 'setting',
    columns: [
      { key: 'name', label: 'Setting' },
      { key: 'value', label: 'Current value' },
      { key: 'updated', label: 'Last updated' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      {
        id: 1,
        name: 'Institution name',
        value: 'Digital Grades University',
        updated: 'Today',
        status: 'Configured',
      },
      {
        id: 2,
        name: 'Default grading scale',
        value: '0 – 20',
        updated: 'Aug 20, 2026',
        status: 'Configured',
      },
      {
        id: 3,
        name: 'Result publication',
        value: 'Administrator approval',
        updated: 'Aug 12, 2026',
        status: 'Configured',
      },
    ],
  },
};

@Component({
  selector: 'app-admin-resource',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-resource.html',
  styleUrl: './admin-resource.scss',
})
export class AdminResourceComponent implements OnInit {
  config!: ResourceConfig;
  rows: ResourceRow[] = [];
  sidebarOpen = false;
  showForm = false;
  searchTerm = '';
  newName = '';
  newDetail = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const key = this.route.snapshot.data['resource'] as ResourceKey;
    this.config = RESOURCES[key];
    this.rows = [...this.config.rows];
  }

  get filteredRows(): ResourceRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.rows.filter((row) =>
          Object.values(row).some((value) => String(value).toLowerCase().includes(term)),
        )
      : this.rows;
  }

  get activeCount(): number {
    return this.rows.filter((row) =>
      ['Active', 'Open', 'Published', 'Configured'].includes(String(row['status'])),
    ).length;
  }

  navigateTo(page: string): void {
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
    if (routes[page]) this.router.navigate([routes[page]]);
    this.sidebarOpen = false;
  }

  addRecord(): void {
    const name = this.newName.trim();
    const detail = this.newDetail.trim();
    if (!name || !detail) return;
    const row: ResourceRow = {
      id: Date.now(),
      [this.config.columns[0].key]: name,
      [this.config.columns[1].key]: detail,
      [this.config.columns[2].key]: '—',
      [this.config.columns[3].key]: 'Active',
    };
    this.rows = [row, ...this.rows];
    this.newName = '';
    this.newDetail = '';
    this.showForm = false;
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin-login']);
  }
}
