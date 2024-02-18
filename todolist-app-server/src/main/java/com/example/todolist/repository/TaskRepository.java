package com.example.todolist.repository;

import com.example.todolist.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Optional<Task> findById(Long taskId);

    Page<Task> findByCreatedBy(Long userId, Pageable pageable);

    List<Task> findByCreatedBy(Long userId);

    Page<Task> findByCreatedByAndCompletedFalse(Long userId, Pageable pageable);

    List<Task> findByCreatedByAndCompletedFalse(Long userId);

    long countByCreatedBy(Long userId);

    List<Task> findByIdIn(List<Long> taskIds);

}
