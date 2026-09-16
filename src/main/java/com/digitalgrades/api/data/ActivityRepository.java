package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.Activity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, String> {
  List<Activity> findTop8ByOrderByCreatedAtDesc();
  List<Activity> findTop6ByOrderByCreatedAtDesc();
}
