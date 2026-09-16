package com.digitalgrades.api.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grade_forms")
public class GradeForm {
  @Id
  private String id;
  private String title;
  private LocalDate submitted;
  private String status;
  private String approvedBy;
  private OffsetDateTime approvedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "class_id")
  private AcademicClass academicClass;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "professor_id")
  private UserAccount professor;

  @ElementCollection
  @CollectionTable(name = "grade_entries", joinColumns = @JoinColumn(name = "grade_form_id"))
  private List<GradeEntry> grades = new ArrayList<>();

  protected GradeForm() {}

  public GradeForm(String id, String title, AcademicClass academicClass, UserAccount professor, LocalDate submitted, String status) {
    this.id = id;
    this.title = title;
    this.academicClass = academicClass;
    this.professor = professor;
    this.submitted = submitted;
    this.status = status;
  }

  public String getId() { return id; }
  public String getTitle() { return title; }
  public AcademicClass getAcademicClass() { return academicClass; }
  public UserAccount getProfessor() { return professor; }
  public LocalDate getSubmitted() { return submitted; }
  public String getStatus() { return status; }
  public String getApprovedBy() { return approvedBy; }
  public OffsetDateTime getApprovedAt() { return approvedAt; }
  public List<GradeEntry> getGrades() { return grades; }
  public void setTitle(String title) { this.title = title; }
  public void setAcademicClass(AcademicClass academicClass) { this.academicClass = academicClass; }
  public void setGrades(List<GradeEntry> grades) { this.grades = new ArrayList<>(grades); }
  public void setStatus(String status) { this.status = status; }
  public void setSubmitted(LocalDate submitted) { this.submitted = submitted; }
  public void setApprovalDetails(String approvedBy, OffsetDateTime approvedAt) {
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
  }
  public void approve(String adminName) { this.status = "Approved"; this.approvedBy = adminName; this.approvedAt = OffsetDateTime.now(); }
}
