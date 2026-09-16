package com.digitalgrades.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Lets Angular own the browser routes while Spring Boot continues to own /api.
 * A browser refresh on any interface page therefore loads the same application
 * instead of returning a server-side 404 error.
 */
@Controller
public class SpaController {
  @GetMapping({
      "/login", "/admin-login", "/professor-login", "/student-login",
      "/admin-dashboard", "/academic-cycles", "/academic-years", "/classes",
      "/professors", "/students", "/subjects", "/grade-forms", "/results",
      "/settings", "/users", "/reports", "/system-settings",
      "/professor-dashboard", "/professor-classes", "/professor-grade-forms",
      "/professor-students", "/student-dashboard", "/student-grades",
      "/student-classes", "/student-profile"
  })
  public String application() {
    return "forward:/index.html";
  }
}
