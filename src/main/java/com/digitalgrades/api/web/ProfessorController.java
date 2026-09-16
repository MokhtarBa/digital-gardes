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
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/professor")
public class ProfessorController {
  private final AcademicClassRepository classes;
  private final GradeFormRepository forms;
  private final CurrentUser currentUser;
  private final ActivityService activities;

  public ProfessorController(
      AcademicClassRepository classes, GradeFormRepository forms,
      CurrentUser currentUser, ActivityService activities) {
    this.classes = classes;
    this.forms = forms;
    this.currentUser = currentUser;
    this.activities = activities;
  }

  public record GradeRequest(String studentId, double score) {}
  public record GradeFormRequest(String title, String classId, List<GradeRequest> grades) {}
  public record ProfessorStudentView(String id, String name, String email, String classId, String className) {}
  public record DashboardView(
      ApiResponses.UserView professor, List<ApiResponses.ClassView> assignedClasses,
      List<ApiResponses.GradeFormView> gradeForms, int totalStudents, long pendingForms, long approvedForms) {}

  @GetMapping("/dashboard")
  public DashboardView dashboard(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserAccount professor = requireProfessor(authorization);
    List<AcademicClass> assigned = classes.findByProfessorId(professor.getId());
    List<GradeForm> gradeForms = forms.findByProfessorId(professor.getId());
    return new DashboardView(
        ApiResponses.UserView.from(professor), assigned.stream().map(ApiResponses.ClassView::from).toList(),
        gradeForms.stream().map(ApiResponses.GradeFormView::from).toList(),
        assigned.stream().mapToInt(item -> item.getStudents().size()).sum(),
        gradeForms.stream().filter(form -> "Pending approval".equals(form.getStatus())).count(),
        gradeForms.stream().filter(form -> "Approved".equals(form.getStatus())).count());
  }

  @GetMapping("/classes")
  public List<ApiResponses.ClassView> classes(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserAccount professor = requireProfessor(authorization);
    return classes.findByProfessorId(professor.getId()).stream().map(ApiResponses.ClassView::from).toList();
  }

  @GetMapping("/students")
  public List<ProfessorStudentView> students(@RequestHeader(value = "Authorization", required = false) String authorization) {
    UserAccount professor = requireProfessor(authorization);
    return classes.findByProfessorId(professor.getId()).stream()
        .flatMap(academicClass -> academicClass.getStudents().stream().map(student ->
            new ProfessorStudentView(student.getId(), student.getName(), student.getEmail(), academicClass.getId(), academicClass.getName())))
        .toList();
  }

  @GetMapping("/grade-forms")
  public List<ApiResponses.GradeFormView> gradeForms(@RequestHeader(value = "Authorization", required = false) String authorization) {
    return forms.findByProfessorId(requireProfessor(authorization).getId()).stream().map(ApiResponses.GradeFormView::from).toList();
  }

  @PostMapping("/grade-forms")
  @Transactional
  public ApiResponses.GradeFormView createDraft(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @RequestBody GradeFormRequest request) {
    UserAccount professor = requireProfessor(authorization);
    AcademicClass academicClass = ownedClass(professor, request.classId());
    List<GradeEntry> grades = validGrades(academicClass, request);
    GradeForm form = new GradeForm(UUID.randomUUID().toString(), title(request.title()), academicClass, professor, LocalDate.now(), "Draft");
    form.setGrades(grades);
    return ApiResponses.GradeFormView.from(forms.save(form));
  }

  @PatchMapping("/grade-forms/{formId}")
  @Transactional
  public ApiResponses.GradeFormView updateDraft(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String formId, @RequestBody GradeFormRequest request) {
    UserAccount professor = requireProfessor(authorization);
    GradeForm form = forms.findById(formId)
        .filter(item -> item.getProfessor().getId().equals(professor.getId()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grade form not found."));
    if (!"Draft".equals(form.getStatus())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only saved drafts can be edited.");
    AcademicClass academicClass = ownedClass(professor, request.classId());
    form.setTitle(title(request.title()));
    form.setAcademicClass(academicClass);
    form.setGrades(validGrades(academicClass, request));
    return ApiResponses.GradeFormView.from(forms.save(form));
  }

  @PatchMapping("/grade-forms/{formId}/submit")
  @Transactional
  public ApiResponses.GradeFormView submit(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String formId) {
    UserAccount professor = requireProfessor(authorization);
    GradeForm form = forms.findById(formId)
        .filter(item -> item.getProfessor().getId().equals(professor.getId()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grade form not found."));
    if (!"Draft".equals(form.getStatus())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This grade form has already been submitted.");
    if (form.getGrades().size() != form.getAcademicClass().getStudents().size()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a grade for every student before submitting.");
    }
    form.setStatus("Pending approval");
    form.setSubmitted(LocalDate.now());
    forms.save(form);
    activities.add("Grade form awaiting approval", form.getTitle() + " · " + form.getAcademicClass().getName() + " submitted by " + professor.getName(), "purple");
    return ApiResponses.GradeFormView.from(form);
  }

  private UserAccount requireProfessor(String authorization) {
    return currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Professor)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor authentication is required."));
  }

  private AcademicClass ownedClass(UserAccount professor, String classId) {
    return classes.findById(classId == null ? "" : classId)
        .filter(item -> item.getProfessor() != null && item.getProfessor().getId().equals(professor.getId()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose one of your classes."));
  }

  private List<GradeEntry> validGrades(AcademicClass academicClass, GradeFormRequest request) {
    if (request.grades() == null || request.grades().size() != academicClass.getStudents().size()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a grade for every student.");
    }
    Set<String> studentIds = academicClass.getStudents().stream().map(UserAccount::getId).collect(java.util.stream.Collectors.toSet());
    Set<String> submittedIds = request.grades().stream().map(GradeRequest::studentId).collect(java.util.stream.Collectors.toSet());
    if (submittedIds.size() != request.grades().size() || !submittedIds.equals(studentIds)
        || request.grades().stream().anyMatch(grade -> grade.score() < 0 || grade.score() > 20)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Grades must be between 0 and 20 for each student in the class.");
    }
    return request.grades().stream().map(grade -> new GradeEntry(grade.studentId(), grade.score())).toList();
  }

  private String title(String value) {
    if (value == null || value.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A grade form title is required.");
    return value.trim();
  }
}
