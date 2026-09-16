package com.digitalgrades.api.web;

import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.digitalgrades.api.security.PasswordService;
import com.digitalgrades.api.security.TokenService;
import com.digitalgrades.api.security.CurrentUser;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserAccountRepository users;
  private final PasswordService passwords;
  private final TokenService tokens;
  private final CurrentUser currentUser;

  public AuthController(UserAccountRepository users, PasswordService passwords, TokenService tokens, CurrentUser currentUser) {
    this.users = users;
    this.passwords = passwords;
    this.tokens = tokens;
    this.currentUser = currentUser;
  }

  public record LoginRequest(String email, String password) {}
  public record LoginResponse(String token, ApiResponses.UserView user) {}

  @PostMapping("/admin/login")
  public LoginResponse adminLogin(@RequestBody LoginRequest request) { return login(request, UserRole.Administrator); }

  @PostMapping("/professor/login")
  public LoginResponse professorLogin(@RequestBody LoginRequest request) { return login(request, UserRole.Professor); }

  @PostMapping("/student/login")
  public LoginResponse studentLogin(@RequestBody LoginRequest request) { return login(request, UserRole.Student); }

  public record ChangePasswordRequest(String currentPassword, String newPassword) {}

  @org.springframework.web.bind.annotation.PatchMapping("/admin/password")
  public Map<String, String> changeAdminPassword(
      @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", required = false) String authorization,
      @RequestBody ChangePasswordRequest request) {
    UserAccount administrator = currentUser.fromAuthorization(authorization)
        .filter(user -> user.getRole() == UserRole.Administrator)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrator authentication is required."));
    if (!passwords.matches(request.currentPassword() == null ? "" : request.currentPassword(), administrator.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your current password is incorrect.");
    }
    if (request.newPassword() == null || request.newPassword().length() < 6) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your new password must have at least 6 characters.");
    }
    administrator.setPasswordHash(passwords.hash(request.newPassword()));
    users.save(administrator);
    return Map.of("message", "Administrator password updated.");
  }

  private LoginResponse login(LoginRequest request, UserRole expectedRole) {
    String email = request.email() == null ? "" : request.email().trim().toLowerCase();
    UserAccount account = users.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
    if (account.getRole() != expectedRole) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN,
          "This account uses the " + account.getRole().name().toLowerCase() + " portal.");
    }
    if (!"Active".equals(account.getStatus()) || !passwords.matches(request.password() == null ? "" : request.password(), account.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }
    return new LoginResponse(tokens.create(account), ApiResponses.UserView.from(account));
  }
}
