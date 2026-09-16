package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.GradeEntry;
import com.digitalgrades.api.domain.GradeForm;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class LegacyDataImporter {
  @Bean
  CommandLineRunner importLegacyData(
      ObjectMapper objectMapper,
      UserAccountRepository users,
      AcademicClassRepository classes,
      GradeFormRepository gradeForms,
      ActivityRepository activities) {
    return arguments -> importIfNeeded(objectMapper, users, classes, gradeForms, activities);
  }

  @Transactional
  void importIfNeeded(
      ObjectMapper objectMapper,
      UserAccountRepository users,
      AcademicClassRepository classes,
      GradeFormRepository gradeForms,
      ActivityRepository activities) throws Exception {
    Path legacyFile = Path.of("..", "server", "data", "admin-data.json").toAbsolutePath().normalize();
    if (!Files.exists(legacyFile)) return;

    JsonNode database = objectMapper.readTree(Files.readString(legacyFile));
    if (users.count() > 0) {
      if (activities.count() == 0) importActivities(database, activities);
      return;
    }
    for (JsonNode item : database.path("users")) {
      UserAccount account = new UserAccount(
          text(item, "id"), text(item, "name"), text(item, "email").toLowerCase(),
          UserRole.valueOf(text(item, "role")), text(item, "passwordHash"));
      account.setStatus(text(item, "status", "Active"));
      users.save(account);
    }

    Map<String, UserAccount> accounts = users.findAll().stream()
        .collect(Collectors.toMap(UserAccount::getId, account -> account));
    for (JsonNode item : database.path("classes")) {
      UserAccount professor = accounts.get(text(item, "professorId"));
      if (professor == null) continue;
      AcademicClass academicClass = new AcademicClass(
          text(item, "id"), text(item, "name"), text(item, "academicYear"), professor);
      LinkedHashSet<UserAccount> students = new LinkedHashSet<>();
      for (JsonNode studentId : item.path("studentIds")) {
        UserAccount student = accounts.get(studentId.asText());
        if (student != null && student.getRole() == UserRole.Student) students.add(student);
      }
      academicClass.setStudents(students);
      classes.save(academicClass);
    }

    Map<String, AcademicClass> academicClasses = classes.findAll().stream()
        .collect(Collectors.toMap(AcademicClass::getId, item -> item));
    for (JsonNode item : database.path("gradeForms")) {
      AcademicClass academicClass = academicClasses.get(text(item, "classId"));
      UserAccount professor = accounts.get(text(item, "professorId"));
      if (academicClass == null || professor == null) continue;
      GradeForm form = new GradeForm(
          text(item, "id"), text(item, "title"), academicClass, professor,
          LocalDate.parse(text(item, "submitted")), text(item, "status"));
      for (JsonNode grade : item.path("grades")) {
        form.getGrades().add(new GradeEntry(text(grade, "studentId"), grade.path("score").asDouble()));
      }
      if (item.hasNonNull("approvedBy") && item.hasNonNull("approvedAt")) {
        form.approve(text(item, "approvedBy"));
      }
      gradeForms.save(form);
    }
    importActivities(database, activities);
  }

  private void importActivities(JsonNode database, ActivityRepository activities) {
    for (JsonNode item : database.path("activities")) {
      activities.save(new com.digitalgrades.api.domain.Activity(
          text(item, "id"), text(item, "title"), text(item, "detail"), text(item, "tone", "blue"),
          OffsetDateTime.parse(text(item, "createdAt"))));
    }
  }

  private String text(JsonNode node, String name) { return text(node, name, ""); }
  private String text(JsonNode node, String name, String fallback) {
    return node.hasNonNull(name) ? node.get(name).asText() : fallback;
  }
}
