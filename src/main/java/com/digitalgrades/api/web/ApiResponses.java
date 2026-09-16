package com.digitalgrades.api.web;

import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.GradeEntry;
import com.digitalgrades.api.domain.GradeForm;
import com.digitalgrades.api.domain.UserAccount;
import java.util.List;

public final class ApiResponses {
  private ApiResponses() {}

  public record UserView(String id, String name, String email, String role, String status) {
    public static UserView from(UserAccount user) {
      return new UserView(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getStatus());
    }
  }

  public record ClassView(
      String id, String name, String academicYear, String professorId, String professor,
      int students, List<String> studentIds, String status) {
    public static ClassView from(AcademicClass academicClass) {
      return new ClassView(
          academicClass.getId(), academicClass.getName(), academicClass.getAcademicYear(),
          academicClass.getProfessor() == null ? "" : academicClass.getProfessor().getId(),
          academicClass.getProfessor() == null ? "Unassigned" : academicClass.getProfessor().getName(),
          academicClass.getStudents().size(), academicClass.getStudents().stream().map(UserAccount::getId).toList(),
          academicClass.getStatus());
    }
  }

  public record GradeView(String studentId, double score) {
    public static GradeView from(GradeEntry grade) { return new GradeView(grade.getStudentId(), grade.getScore()); }
  }

  public record GradeFormView(
      String id, String title, String classId, String className, String professorId, String professor,
      String submitted, String progress, List<GradeView> grades, String status, String approvedBy, String approvedAt) {
    public static GradeFormView from(GradeForm form) {
      return new GradeFormView(
          form.getId(), form.getTitle(), form.getAcademicClass().getId(), form.getAcademicClass().getName(),
          form.getProfessor().getId(), form.getProfessor().getName(), form.getSubmitted().toString(),
          form.getGrades().size() + " / " + form.getAcademicClass().getStudents().size() + " graded",
          form.getGrades().stream().map(GradeView::from).toList(), form.getStatus(), form.getApprovedBy(),
          form.getApprovedAt() == null ? null : form.getApprovedAt().toString());
    }
  }
}
