package com.digitalgrades.api.web;

import com.digitalgrades.api.data.GradeFormRepository;
import com.digitalgrades.api.domain.GradeForm;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/grade-forms")
public class GradeFormsController {
  private final GradeFormRepository forms;
  private final CurrentUser currentUser;
  private final ActivityService activities;

  public GradeFormsController(GradeFormRepository forms, CurrentUser currentUser, ActivityService activities) {
    this.forms = forms;
    this.currentUser = currentUser;
    this.activities = activities;
  }

  @GetMapping
  public List<ApiResponses.GradeFormView> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
    requireAdmin(authorization);
    return forms.findAll().stream()
        .filter(form -> !"Draft".equals(form.getStatus()))
        .map(ApiResponses.GradeFormView::from)
        .toList();
  }

  @PatchMapping("/{formId}/approve")
  @Transactional
  public ApiResponses.GradeFormView approve(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String formId) {
    var administrator = currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
    GradeForm form = forms.findById(formId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grade form not found."));
    if (!"Pending approval".equals(form.getStatus())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only submitted grade forms can be approved.");
    }
    form.approve(administrator.getName());
    forms.save(form);
    activities.add("Grade form approved", form.getTitle() + " · " + form.getAcademicClass().getName(), "green");
    return ApiResponses.GradeFormView.from(form);
  }

  private void requireAdmin(String authorization) {
    currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
  }
}
