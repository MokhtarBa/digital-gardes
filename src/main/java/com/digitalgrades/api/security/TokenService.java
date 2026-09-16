package com.digitalgrades.api.security;

import com.digitalgrades.api.domain.UserAccount;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  private static final long EIGHT_HOURS = 8 * 60 * 60;
  private final String secret;

  public TokenService(@Value("${app.token-secret:digital-grades-local-java-token-secret}") String secret) {
    this.secret = secret;
  }

  public String create(UserAccount user) {
    String payload = user.getId() + ":" + (Instant.now().getEpochSecond() + EIGHT_HOURS);
    String encoded = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    return encoded + "." + signature(encoded);
  }

  public String userId(String token) {
    if (token == null) return null;
    String[] pieces = token.split("\\.", 2);
    if (pieces.length != 2 || !constantTimeEquals(signature(pieces[0]), pieces[1])) return null;
    try {
      String decoded = new String(Base64.getUrlDecoder().decode(pieces[0]), StandardCharsets.UTF_8);
      String[] values = decoded.split(":", 2);
      if (values.length != 2 || Long.parseLong(values[1]) < Instant.now().getEpochSecond()) return null;
      return values[0];
    } catch (IllegalArgumentException exception) {
      return null;
    }
  }

  private String signature(String payload) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception exception) {
      throw new IllegalStateException("Could not create a session token.", exception);
    }
  }

  private boolean constantTimeEquals(String left, String right) {
    byte[] leftBytes = left.getBytes(StandardCharsets.UTF_8);
    byte[] rightBytes = right.getBytes(StandardCharsets.UTF_8);
    if (leftBytes.length != rightBytes.length) return false;
    int result = 0;
    for (int index = 0; index < leftBytes.length; index++) result |= leftBytes[index] ^ rightBytes[index];
    return result == 0;
  }
}
