package com.digitalgrades.api.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "activities")
public class Activity {
  @Id
  private String id;
  private String title;
  private String detail;
  private String tone;
  private OffsetDateTime createdAt;

  protected Activity() {}

  public Activity(String id, String title, String detail, String tone, OffsetDateTime createdAt) {
    this.id = id;
    this.title = title;
    this.detail = detail;
    this.tone = tone;
    this.createdAt = createdAt;
  }

  public String getId() { return id; }
  public String getTitle() { return title; }
  public String getDetail() { return detail; }
  public String getTone() { return tone; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
}
