package com.digitalgrades.api.security;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import org.bouncycastle.crypto.generators.SCrypt;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
  private static final int COST = 16_384;
  private static final int BLOCK_SIZE = 8;
  private static final int PARALLELIZATION = 1;
  private static final int KEY_LENGTH = 64;
  private final SecureRandom secureRandom = new SecureRandom();

  /** Matches the scrypt format used by the former Node.js server: saltHex:hashHex. */
  public boolean matches(String password, String storedHash) {
    String[] pieces = storedHash == null ? new String[0] : storedHash.split(":", 2);
    if (pieces.length != 2) return false;
    byte[] expected = fromHex(pieces[1]);
    byte[] actual = derive(password, fromHex(pieces[0]));
    return constantTimeEquals(expected, actual);
  }

  public String hash(String password) {
    byte[] salt = new byte[16];
    secureRandom.nextBytes(salt);
    return toHex(salt) + ":" + toHex(derive(password, salt));
  }

  private byte[] derive(String password, byte[] salt) {
    return SCrypt.generate(password.getBytes(StandardCharsets.UTF_8), salt, COST, BLOCK_SIZE, PARALLELIZATION, KEY_LENGTH);
  }

  private boolean constantTimeEquals(byte[] left, byte[] right) {
    if (left.length != right.length) return false;
    int difference = 0;
    for (int index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
    return difference == 0;
  }

  private byte[] fromHex(String value) {
    if ((value.length() & 1) == 1) return new byte[0];
    byte[] bytes = new byte[value.length() / 2];
    for (int index = 0; index < value.length(); index += 2) {
      int high = Character.digit(value.charAt(index), 16);
      int low = Character.digit(value.charAt(index + 1), 16);
      if (high < 0 || low < 0) return new byte[0];
      bytes[index / 2] = (byte) ((high << 4) + low);
    }
    return bytes;
  }

  private String toHex(byte[] bytes) {
    StringBuilder builder = new StringBuilder(bytes.length * 2);
    for (byte value : bytes) builder.append(String.format("%02x", value));
    return builder.toString();
  }
}
