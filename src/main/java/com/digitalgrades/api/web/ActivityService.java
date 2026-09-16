package com.digitalgrades.api.web;

import com.digitalgrades.api.data.ActivityRepository;
import com.digitalgrades.api.domain.Activity;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {
  private final ActivityRepository activities;

  public ActivityService(ActivityRepository activities) { this.activities = activities; }

  public void add(String title, String detail, String tone) {
    activities.save(new Activity(UUID.randomUUID().toString(), title, detail, tone, OffsetDateTime.now()));
  }
}
