package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
  Optional<UserAccount> findByEmailIgnoreCase(String email);
  List<UserAccount> findByRole(UserRole role);
  long countByRole(UserRole role);
}
