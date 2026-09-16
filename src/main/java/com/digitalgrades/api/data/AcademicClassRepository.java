package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.AcademicClass;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicClassRepository extends JpaRepository<AcademicClass, String> {
  List<AcademicClass> findByProfessorId(String professorId);
}
