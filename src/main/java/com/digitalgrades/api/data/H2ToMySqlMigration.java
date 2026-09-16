package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.AcademicClass;
import com.digitalgrades.api.domain.Activity;
import com.digitalgrades.api.domain.GradeEntry;
import com.digitalgrades.api.domain.GradeForm;
import com.digitalgrades.api.domain.UserAccount;
import com.digitalgrades.api.domain.UserRole;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

/** Copies local H2 data into an empty MySQL database the first time the mysql profile starts. */
@Configuration
@Profile("mysql")
public class H2ToMySqlMigration {
  private static final String H2_URL = "jdbc:h2:file:./data/digital-grades;AUTO_SERVER=TRUE";

  @Bean
  CommandLineRunner migrateH2Data(
      UserAccountRepository users,
      AcademicClassRepository classes,
      GradeFormRepository gradeForms,
      ActivityRepository activities) {
    return arguments -> copyIfMySqlIsEmpty(users, classes, gradeForms, activities);
  }

  @Transactional
  void copyIfMySqlIsEmpty(
      UserAccountRepository users,
      AcademicClassRepository classes,
      GradeFormRepository gradeForms,
      ActivityRepository activities) throws Exception {
    if (users.count() > 0) return;

    try (Connection source = DriverManager.getConnection(H2_URL, "sa", "")) {
      Map<String, UserAccount> accounts = copyUsers(source, users);
      Map<String, AcademicClass> academicClasses = copyClasses(source, classes, accounts);
      copyGradeForms(source, gradeForms, academicClasses, accounts);
      copyActivities(source, activities);
    }
  }

  private Map<String, UserAccount> copyUsers(Connection source, UserAccountRepository users) throws Exception {
    Map<String, UserAccount> accounts = new LinkedHashMap<>();
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT ID, NAME, EMAIL, ROLE, STATUS, PASSWORD_HASH FROM APP_USERS");
        ResultSet rows = statement.executeQuery()) {
      while (rows.next()) {
        UserAccount account = new UserAccount(
            rows.getString("ID"), rows.getString("NAME"), rows.getString("EMAIL"),
            UserRole.valueOf(rows.getString("ROLE")), rows.getString("PASSWORD_HASH"));
        account.setStatus(rows.getString("STATUS"));
        accounts.put(account.getId(), users.save(account));
      }
    }
    return accounts;
  }

  private Map<String, AcademicClass> copyClasses(
      Connection source,
      AcademicClassRepository classes,
      Map<String, UserAccount> accounts) throws Exception {
    Map<String, AcademicClass> copied = new LinkedHashMap<>();
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT ID, NAME, ACADEMIC_YEAR, STATUS, PROFESSOR_ID FROM ACADEMIC_CLASSES");
        ResultSet rows = statement.executeQuery()) {
      while (rows.next()) {
        AcademicClass academicClass = new AcademicClass(
            rows.getString("ID"), rows.getString("NAME"), rows.getString("ACADEMIC_YEAR"),
            accounts.get(rows.getString("PROFESSOR_ID")));
        academicClass.setStudents(classStudents(source, rows.getString("ID"), accounts));
        copied.put(academicClass.getId(), classes.save(academicClass));
      }
    }
    return copied;
  }

  private LinkedHashSet<UserAccount> classStudents(
      Connection source, String classId, Map<String, UserAccount> accounts) throws Exception {
    LinkedHashSet<UserAccount> students = new LinkedHashSet<>();
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT STUDENT_ID FROM CLASS_STUDENTS WHERE CLASS_ID = ?")) {
      statement.setString(1, classId);
      try (ResultSet rows = statement.executeQuery()) {
        while (rows.next()) {
          UserAccount student = accounts.get(rows.getString("STUDENT_ID"));
          if (student != null) students.add(student);
        }
      }
    }
    return students;
  }

  private void copyGradeForms(
      Connection source,
      GradeFormRepository gradeForms,
      Map<String, AcademicClass> academicClasses,
      Map<String, UserAccount> accounts) throws Exception {
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT ID, TITLE, SUBMITTED, STATUS, APPROVED_BY, APPROVED_AT, CLASS_ID, PROFESSOR_ID FROM GRADE_FORMS");
        ResultSet rows = statement.executeQuery()) {
      while (rows.next()) {
        AcademicClass academicClass = academicClasses.get(rows.getString("CLASS_ID"));
        UserAccount professor = accounts.get(rows.getString("PROFESSOR_ID"));
        if (academicClass == null || professor == null) continue;
        GradeForm form = new GradeForm(
            rows.getString("ID"), rows.getString("TITLE"), academicClass, professor,
            rows.getObject("SUBMITTED", LocalDate.class), rows.getString("STATUS"));
        form.setGrades(formGrades(source, form.getId()));
        OffsetDateTime approvedAt = rows.getObject("APPROVED_AT", OffsetDateTime.class);
        if (approvedAt != null) form.setApprovalDetails(rows.getString("APPROVED_BY"), approvedAt);
        gradeForms.save(form);
      }
    }
  }

  private java.util.List<GradeEntry> formGrades(Connection source, String formId) throws Exception {
    java.util.List<GradeEntry> grades = new java.util.ArrayList<>();
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT STUDENT_ID, SCORE FROM GRADE_ENTRIES WHERE GRADE_FORM_ID = ?")) {
      statement.setString(1, formId);
      try (ResultSet rows = statement.executeQuery()) {
        while (rows.next()) grades.add(new GradeEntry(rows.getString("STUDENT_ID"), rows.getDouble("SCORE")));
      }
    }
    return grades;
  }

  private void copyActivities(Connection source, ActivityRepository activities) throws Exception {
    try (PreparedStatement statement = source.prepareStatement(
        "SELECT ID, TITLE, DETAIL, TONE, CREATED_AT FROM ACTIVITIES");
        ResultSet rows = statement.executeQuery()) {
      while (rows.next()) {
        activities.save(new Activity(
            rows.getString("ID"), rows.getString("TITLE"), rows.getString("DETAIL"),
            rows.getString("TONE"), rows.getObject("CREATED_AT", OffsetDateTime.class)));
      }
    }
  }
}
