package com.digitalgrades.api.web;

import com.digitalgrades.api.data.AcademicClassRepository;
import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/classes")
public class ClassesController {
  private final AcademicClassRepository classes;
  private final UserAccountRepository users;
  private final CurrentUser currentUser;
  private final com.digitalgrades.api.data.GradeFormRepository forms;

  public ClassesController(AcademicClassRepository classes, UserAccountRepository users, CurrentUser currentUser,
      com.digitalgrades.api.data.GradeFormRepository forms) {
    this.classes = classes;
    this.users = users;
    this.currentUser = currentUser;
    this.forms = forms;
  }

  public record ClassRequest(String name, String academicYear, String professorId, List<String> studentIds) {}

  @GetMapping
  public List<ApiResponses.ClassView> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
    requireAdmin(authorization);
    return classes.findAll().stream().map(ApiResponses.ClassView::from).toList();
  }

  @PostMapping
  @Transactional
  public ApiResponses.ClassView create(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @RequestBody ClassRequest request) {
    requireAdmin(authorization);
    AcademicClass academicClass = new AcademicClass(
        UUID.randomUUID().toString(), required(request.name(), "Class name"), required(request.academicYear(), "Academic year"),
        professor(request.professorId()));
    academicClass.setStudents(students(request.studentIds()));
    return ApiResponses.ClassView.from(classes.save(academicClass));
  }

  @DeleteMapping("/{classId}")
  @Transactional
  public java.util.Map<String, String> delete(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String classId) {
    requireAdmin(authorization);
    AcademicClass academicClass = classes.findById(classId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found."));
    forms.deleteByAcademicClassId(classId);
    classes.delete(academicClass);
    return java.util.Map.of("message", academicClass.getName() + " was deleted.");
  }

  @PatchMapping("/{classId}")
  @Transactional
  public ApiResponses.ClassView update(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String classId, @RequestBody ClassRequest request) {
    requireAdmin(authorization);
    AcademicClass academicClass = classes.findById(classId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found."));
    academicClass.setName(required(request.name(), "Class name"));
    academicClass.setAcademicYear(required(request.academicYear(), "Academic year"));
    academicClass.setProfessor(professor(request.professorId()));
    academicClass.setStudents(students(request.studentIds()));
    return ApiResponses.ClassView.from(classes.save(academicClass));
  }

  public record ProfessorRequest(String professorId) {}

  @PatchMapping("/{classId}/professor")
  @Transactional
  public ApiResponses.ClassView assignProfessor(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String classId, @RequestBody ProfessorRequest request) {
    requireAdmin(authorization);
    AcademicClass academicClass = classes.findById(classId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Class not found."));
    academicClass.setProfessor(professor(request.professorId()));
    return ApiResponses.ClassView.from(classes.save(academicClass));
  }

  private UserAccount professor(String professorId) {
    return users.findById(professorId == null ? "" : professorId)
        .filter(user -> user.getRole() == UserRole.Professor)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an existing professor."));
  }

  private Set<UserAccount> students(List<String> studentIds) {
    if (studentIds == null || studentIds.isEmpty() || new LinkedHashSet<>(studentIds).size() != studentIds.size()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose at least one different student.");
    }
    Set<UserAccount> result = new LinkedHashSet<>();
    for (String studentId : studentIds) {
      UserAccount student = users.findById(studentId)
          .filter(user -> user.getRole() == UserRole.Student)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose existing student accounts."));
      result.add(student);
    }
    return result;
  }

  private String required(String value, String field) {
    if (value == null || value.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required.");
    return value.trim();
  }

  private void requireAdmin(String authorization) {
    currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
  }
}
