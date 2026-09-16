package com.digitalgrades.api.web;

import com.digitalgrades.api.data.ActivityRepository;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {
  private final ActivityRepository activities;
  private final CurrentUser currentUser;

  public NotificationsController(ActivityRepository activities, CurrentUser currentUser) {
    this.activities = activities;
    this.currentUser = currentUser;
  }

  public record ActivityView(String id, String title, String detail, String tone, String createdAt) {}

  @GetMapping
  public List<ActivityView> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
    currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
    return activities.findTop8ByOrderByCreatedAtDesc().stream()
        .map(item -> new ActivityView(item.getId(), item.getTitle(), item.getDetail(), item.getTone(), item.getCreatedAt().toString()))
        .toList();
  }
}
