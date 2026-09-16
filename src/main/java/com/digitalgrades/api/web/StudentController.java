package com.digitalgrades.api.web;

import com.digitalgrades.api.data.AcademicClassRepository;
import com.digitalgrades.api.data.GradeFormRepository;
import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.GradeEntry;
import com.digitalgrades.api.domain.GradeForm;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import com.digitalgrades.api.security.PasswordService;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/student")
public class StudentController {
  private final AcademicClassRepository classes;
  private final GradeFormRepository forms;
  private final CurrentUser currentUser;
  private final PasswordService passwords;
  private final UserAccountRepository users;

  public StudentController(
      AcademicClassRepository classes, GradeFormRepository forms,
      CurrentUser currentUser, PasswordService passwords, UserAccountRepository users) {
    this.classes = classes;
    this.forms = forms;
    this.currentUser = currentUser;
    this.passwords = passwords;
    this.users = users;
  }

  public record GradeResult(
      String id, String title, String classId, String className, String professor,
      String submitted, double score, int maximumScore) {}
  public record DashboardView(
      ApiResponses.UserView student, List<ApiResponses.ClassView> classes,
      List<GradeResult> grades, Double overallAverage) {}
  public record PasswordRequest(String currentPassword, String newPassword) {}

  @GetMapping("/dashboard")
  public DashboardView dashboard(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserAccount student = requireStudent(authorization);
    List<AcademicClass> assigned = classesFor(student);
    List<GradeResult> grades = gradesFor(student, assigned);
    Double average = grades.isEmpty() ? null : grades.stream().mapToDouble(GradeResult::score).average().orElseThrow();
    return new DashboardView(ApiResponses.UserView.from(student), assigned.stream().map(ApiResponses.ClassView::from).toList(), grades, average);
  }

  @GetMapping("/classes")
  public List<ApiResponses.ClassView> classes(@RequestHeader(value = "Authorization", required = false) String authorization) {
    return classesFor(requireStudent(authorization)).stream().map(ApiResponses.ClassView::from).toList();
  }

  @GetMapping("/grades")
  public List<GradeResult> grades(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserAccount student = requireStudent(authorization);
    return gradesFor(student, classesFor(student));
  }

  @PatchMapping("/password")
  @Transactional
  public Map<String, String> changePassword(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @RequestBody PasswordRequest request) {
    UserAccount student = requireStudent(authorization);
    if (!passwords.matches(request.currentPassword() == null ? "" : request.currentPassword(), student.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your current password is incorrect.");
    }
    if (request.newPassword() == null || request.newPassword().length() < 6) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your new password must have at least 6 characters.");
    }
    student.setPasswordHash(passwords.hash(request.newPassword()));
    users.save(student);
    return Map.of("message", "Password updated.");
  }

  private List<AcademicClass> classesFor(UserAccount student) {
    return classes.findAll().stream().filter(item -> item.getStudents().stream().anyMatch(user -> user.getId().equals(student.getId()))).toList();
  }

  private List<GradeResult> gradesFor(UserAccount student, List<AcademicClass> assignedClasses) {
    Set<String> classIds = assignedClasses.stream().map(AcademicClass::getId).collect(Collectors.toSet());
    return forms.findAll().stream()
        .filter(form -> "Approved".equals(form.getStatus()) && classIds.contains(form.getAcademicClass().getId()))
        .flatMap(form -> form.getGrades().stream()
            .filter(grade -> grade.getStudentId().equals(student.getId()))
            .map(grade -> new GradeResult(form.getId(), form.getTitle(), form.getAcademicClass().getId(),
                form.getAcademicClass().getName(), form.getProfessor().getName(), form.getSubmitted().toString(),
                grade.getScore(), 20)))
        .toList();
  }

  private UserAccount requireStudent(String authorization) {
    return currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Student)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Student authentication is required."));
  }
}
