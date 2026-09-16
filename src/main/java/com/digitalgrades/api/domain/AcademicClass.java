package com.digitalgrades.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "academic_classes")
public class AcademicClass {
  @Id
  private String id;
  private String name;
  private String academicYear;
  private String status = "Active";

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "professor_id")
  private UserAccount professor;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "class_students",
      joinColumns = @JoinColumn(name = "class_id"),
      inverseJoinColumns = @JoinColumn(name = "student_id"))
  private Set<UserAccount> students = new LinkedHashSet<>();

  protected AcademicClass() {}

  public AcademicClass(String id, String name, String academicYear, UserAccount professor) {
    this.id = id;
    this.name = name;
    this.academicYear = academicYear;
    this.professor = professor;
  }

  public String getId() { return id; }
  public String getName() { return name; }
  public String getAcademicYear() { return academicYear; }
  public String getStatus() { return status; }
  public UserAccount getProfessor() { return professor; }
  public Set<UserAccount> getStudents() { return students; }
  public void setName(String name) { this.name = name; }
  public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
  public void setProfessor(UserAccount professor) { this.professor = professor; }
  public void setStudents(Set<UserAccount> students) { this.students = new LinkedHashSet<>(students); }
}
