package com.digitalgrades.api.web;

import com.digitalgrades.api.data.AcademicClassRepository;
import com.digitalgrades.api.data.ActivityRepository;
import com.digitalgrades.api.data.GradeFormRepository;
import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
  private final UserAccountRepository users;
  private final AcademicClassRepository classes;
  private final GradeFormRepository gradeForms;
  private final CurrentUser currentUser;
  private final ActivityRepository activities;

  public DashboardController(
      UserAccountRepository users, AcademicClassRepository classes,
      GradeFormRepository gradeForms, CurrentUser currentUser, ActivityRepository activities) {
    this.users = users;
    this.classes = classes;
    this.gradeForms = gradeForms;
    this.currentUser = currentUser;
    this.activities = activities;
  }

  public record DashboardView(
      long totalClasses, long activeClasses, int enrolledStudents, long professors, long students,
      long administrators, long submittedForms, long pendingForms, long approvedForms, List<NotificationsController.ActivityView> activities) {}

  @GetMapping
  public DashboardView summary(@RequestHeader(value = "Authorization", required = false) String authorization) {
    requireAdmin(authorization);
    List<com.digitalgrades.api.domain.AcademicClass> allClasses = classes.findAll();
    return new DashboardView(
        allClasses.size(), allClasses.stream().filter(item -> "Active".equals(item.getStatus())).count(),
        allClasses.stream().mapToInt(item -> item.getStudents().size()).sum(),
        users.countByRole(UserRole.Professor), users.countByRole(UserRole.Student), users.countByRole(UserRole.Administrator),
        gradeForms.count() - gradeForms.countByStatus("Draft"), gradeForms.countByStatus("Pending approval"),
        gradeForms.countByStatus("Approved"), activities.findTop6ByOrderByCreatedAtDesc().stream()
            .map(item -> new NotificationsController.ActivityView(item.getId(), item.getTitle(), item.getDetail(), item.getTone(), item.getCreatedAt().toString()))
            .toList());
  }

  private void requireAdmin(String authorization) {
    currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED,
            "Administrator authentication is required."));
  }
}
