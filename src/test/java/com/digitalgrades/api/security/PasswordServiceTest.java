package com.digitalgrades.api.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PasswordServiceTest {
  private final PasswordService passwords = new PasswordService();

  @Test
  void validatesAHashCreatedByTheFormerNodeServer() {
    String nodeScryptHash =
        "13cb14ad2eb3d32e0dd29c0fce6e7327:"
            + "ebbeeef2fe3b638ea46d169cd4a5c9e07285f7cfe7f458d6b4634034dff0e0a8"
            + "0289f139eeb48b275b4e944fae0036864aebd2b4f6386c3e84a03cd50040ac0c";

    assertTrue(passwords.matches("admin123", nodeScryptHash));
    assertFalse(passwords.matches("incorrect-password", nodeScryptHash));
  }
}
