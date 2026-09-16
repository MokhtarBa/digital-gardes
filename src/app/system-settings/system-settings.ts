import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../admin-shared/admin-api.service';
import { AdminSidebarComponent } from '../admin-shared/admin-sidebar';
import { AdminDataStorageService } from '../admin-shared/admin-data-storage.service';
import { AdminTopbarComponent } from '../admin-shared/admin-topbar';

const SETTINGS_STORAGE_KEY = 'digital-grades.admin.system-settings.v1';
const DEFAULT_SETTINGS: SystemSettings = {
  institutionName: 'Digital Grades University',
  institutionEmail: 'contact@digitalgrades.edu',
  institutionPhone: '+221 33 000 00 00',
  institutionAddress: 'Dakar, Senegal',
  gradingScale: '0 – 20',
  currentAcademicCycle: '2026–2027',
  currentSemester: 'Semester 1',
  passingGrade: 10,
  allowGradeEditing: true,
  emailNotifications: true,
  approvalNotifications: true,
};

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [FormsModule, AdminSidebarComponent, AdminTopbarComponent],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.scss',
})
export class SystemSettingsComponent {
  private readonly storage = inject(AdminDataStorageService);
  private readonly adminApi = inject(AdminApiService);
  private readonly storedSettings = this.storage.load(
    SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS,
    isSystemSettings,
  );

  institutionName = this.storedSettings.institutionName;
  institutionEmail = this.storedSettings.institutionEmail;
  institutionPhone = this.storedSettings.institutionPhone;
  institutionAddress = this.storedSettings.institutionAddress;
  gradingScale = this.storedSettings.gradingScale;
  currentAcademicCycle = this.storedSettings.currentAcademicCycle;
  currentSemester = this.storedSettings.currentSemester;
  passingGrade = this.storedSettings.passingGrade;
  allowGradeEditing = this.storedSettings.allowGradeEditing;
  emailNotifications = this.storedSettings.emailNotifications;
  approvalNotifications = this.storedSettings.approvalNotifications;

  savedInstitutionName = this.institutionName;
  savedGradingScale = this.gradingScale;
  savedAcademicCycle = this.currentAcademicCycle;
  formError = '';
  notice = '';
  lastSaved = 'Current saved configuration';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordNotice = '';
  isChangingPassword = false;

  clearSaveNotice(): void {
    this.notice = '';
    this.formError = '';
  }

  saveSettings(): void {
    const institutionName = this.institutionName.trim();
    const gradingScale = this.gradingScale.trim();
    const academicCycle = this.currentAcademicCycle.trim();

    if (
      !institutionName ||
      !this.institutionEmail.trim() ||
      !gradingScale ||
      !academicCycle ||
      this.passingGrade < 0
    ) {
      this.formError =
        'Complete the required university, academic-year, and grade-rule fields before saving.';
      this.notice = '';
      return;
    }

    this.institutionName = institutionName;
    this.gradingScale = gradingScale;
    this.currentAcademicCycle = academicCycle;
    this.savedInstitutionName = institutionName;
    this.savedGradingScale = gradingScale;
    this.savedAcademicCycle = academicCycle;
    this.storage.save(SETTINGS_STORAGE_KEY, {
      institutionName,
      institutionEmail: this.institutionEmail.trim(),
      institutionPhone: this.institutionPhone.trim(),
      institutionAddress: this.institutionAddress.trim(),
      gradingScale,
      currentAcademicCycle: academicCycle,
      currentSemester: this.currentSemester,
      passingGrade: Number(this.passingGrade),
      allowGradeEditing: this.allowGradeEditing,
      emailNotifications: this.emailNotifications,
      approvalNotifications: this.approvalNotifications,
    });
    this.lastSaved = `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    this.formError = '';
    this.notice = 'Settings saved successfully.';
  }

  changePassword(): void {
    this.passwordError = '';
    this.passwordNotice = '';
    if (!this.currentPassword || this.newPassword.length < 6) {
      this.passwordError =
        'Enter your current password and a new password with at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'The new password and confirmation do not match.';
      return;
    }

    this.isChangingPassword = true;
    this.adminApi.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: ({ message }) => {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;
        this.passwordNotice = message;
      },
      error: (error: { error?: { message?: string } }) => {
        this.isChangingPassword = false;
        this.passwordError =
          error.error?.message ||
          'Could not change the password. Start the backend with npm run server:java and try again.';
      },
    });
  }
}

interface SystemSettings {
  institutionName: string;
  institutionEmail: string;
  institutionPhone: string;
  institutionAddress: string;
  gradingScale: string;
  currentAcademicCycle: string;
  currentSemester: string;
  passingGrade: number;
  allowGradeEditing: boolean;
  emailNotifications: boolean;
  approvalNotifications: boolean;
}

function isSystemSettings(value: unknown): value is SystemSettings {
  return (
    isRecord(value) &&
    typeof value['institutionName'] === 'string' &&
    typeof value['institutionEmail'] === 'string' &&
    typeof value['institutionPhone'] === 'string' &&
    typeof value['institutionAddress'] === 'string' &&
    typeof value['gradingScale'] === 'string' &&
    typeof value['currentAcademicCycle'] === 'string' &&
    typeof value['currentSemester'] === 'string' &&
    typeof value['passingGrade'] === 'number' &&
    typeof value['allowGradeEditing'] === 'boolean' &&
    typeof value['emailNotifications'] === 'boolean' &&
    typeof value['approvalNotifications'] === 'boolean'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
