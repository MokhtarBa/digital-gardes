package com.digitalgrades.api.web;

import com.digitalgrades.api.data.AcademicClassRepository;
import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.CurrentUser;
import com.digitalgrades.api.security.PasswordService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
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
@RequestMapping("/api/users")
public class UsersController {
  private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
  private final UserAccountRepository users;
  private final AcademicClassRepository classes;
  private final CurrentUser currentUser;
  private final PasswordService passwords;
  private final com.digitalgrades.api.data.GradeFormRepository forms;

  public UsersController(
      UserAccountRepository users, AcademicClassRepository classes,
      CurrentUser currentUser, PasswordService passwords, com.digitalgrades.api.data.GradeFormRepository forms) {
    this.users = users;
    this.classes = classes;
    this.currentUser = currentUser;
    this.passwords = passwords;
    this.forms = forms;
  }

  public record CreateUserRequest(String name, String email, String role, String password) {}
  public record PasswordRequest(String password) {}

  @GetMapping
  public List<ApiResponses.UserView> all(@RequestHeader(value = "Authorization", required = false) String authorization) {
    requireAdmin(authorization);
    return users.findAll().stream().map(ApiResponses.UserView::from).toList();
  }

  @PostMapping
  @Transactional
  public ApiResponses.UserView create(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @RequestBody CreateUserRequest request) {
    requireAdmin(authorization);
    String name = request.name() == null ? "" : request.name().trim();
    String email = request.email() == null ? "" : request.email().trim().toLowerCase();
    String password = request.password() == null ? "" : request.password();
    if (name.isBlank() || !EMAIL.matcher(email).matches() || password.length() < 6) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, valid email, and a password of at least 6 characters are required.");
    }
    UserRole role;
    try { role = UserRole.valueOf(request.role()); }
    catch (Exception exception) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose Administrator, Professor, or Student."); }
    if (users.findByEmailIgnoreCase(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "That email address is already in use.");
    }
    UserAccount user = users.save(new UserAccount(UUID.randomUUID().toString(), name, email, role, passwords.hash(password)));
    return ApiResponses.UserView.from(user);
  }

  @PatchMapping("/{userId}/password")
  @Transactional
  public Map<String, String> setPassword(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String userId, @RequestBody PasswordRequest request) {
    requireAdmin(authorization);
    if (request.password() == null || request.password().length() < 6) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must have at least 6 characters.");
    }
    UserAccount user = users.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    user.setPasswordHash(passwords.hash(request.password()));
    users.save(user);
    return Map.of("message", "Password updated.");
  }

  @DeleteMapping("/{userId}")
  @Transactional
  public Map<String, String> delete(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @PathVariable String userId) {
    UserAccount administrator = requireAdmin(authorization);
    UserAccount user = users.findById(userId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    if (user.getId().equals(administrator.getId())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete the administrator account you are using.");
    }
    if (user.getRole() == UserRole.Administrator && users.countByRole(UserRole.Administrator) <= 1) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Keep at least one administrator account in the portal.");
    }
    if (user.getRole() == UserRole.Professor) {
      for (AcademicClass academicClass : classes.findByProfessorId(user.getId())) academicClass.setProfessor(null);
      forms.deleteByProfessorId(user.getId());
      classes.flush();
    }
    if (user.getRole() == UserRole.Student) {
      for (AcademicClass academicClass : classes.findAll()) academicClass.getStudents().remove(user);
      classes.flush();
    }
    users.delete(user);
    return Map.of("message", user.getName() + " was deleted.");
  }

  private UserAccount requireAdmin(String authorization) {
    return currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
  }
}
