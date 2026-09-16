package com.digitalgrades.api.security;

import com.digitalgrades.api.data.UserAccountRepository;
import com.digitalgrades.api.domain.UserAccount;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
  private final TokenService tokens;
  private final UserAccountRepository users;

  public CurrentUser(TokenService tokens, UserAccountRepository users) {
    this.tokens = tokens;
    this.users = users;
  }

  public Optional<UserAccount> fromAuthorization(String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) return Optional.empty();
    String id = tokens.userId(authorization.substring(7));
    return id == null ? Optional.empty() : users.findById(id).filter(user -> "Active".equals(user.getStatus()));
  }
}
