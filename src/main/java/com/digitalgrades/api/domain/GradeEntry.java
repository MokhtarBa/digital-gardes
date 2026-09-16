package com.digitalgrades.api.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class GradeEntry {
  private String studentId;
  private double score;

  protected GradeEntry() {}
  public GradeEntry(String studentId, double score) { this.studentId = studentId; this.score = score; }
  public String getStudentId() { return studentId; }
  public double getScore() { return score; }
}
