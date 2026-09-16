package com.digitalgrades.api.data;

import com.digitalgrades.api.domain.GradeForm;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface GradeFormRepository extends JpaRepository<GradeForm, String> {
  List<GradeForm> findByProfessorId(String professorId);
  long countByStatus(String status);
  @Transactional
  long deleteByAcademicClassId(String classId);
  @Transactional
  long deleteByProfessorId(String professorId);
}
