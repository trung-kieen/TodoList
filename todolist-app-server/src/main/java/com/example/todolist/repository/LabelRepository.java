package com.example.todolist.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.todolist.model.Label;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Long> {
  // TODO implement label repository
    // @Query("SELECT NEW com.example.todolist.model.ChoiceVoteCount(v.choice.id, count(v.id)) FROM Vote v WHERE v.task.id in :taskIds GROUP BY v.choice.id")
    // List<ChoiceVoteCount> countByTaskIdInGroupByChoiceId(@Param("taskIds") List<Long> taskIds);

    // @Query("SELECT NEW com.example.todolist.model.ChoiceVoteCount(v.choice.id, count(v.id)) FROM Vote v WHERE v.task.id = :taskId GROUP BY v.choice.id")
    // List<ChoiceVoteCount> countByTaskIdGroupByChoiceId(@Param("taskId") Long taskId);

    // @Query("SELECT v FROM Vote v where v.user.id = :userId and v.task.id in :taskIds")
    // List<Vote> findByUserIdAndTaskIdIn(@Param("userId") Long userId, @Param("taskIds") List<Long> taskIds);

    // @Query("SELECT v FROM Vote v where v.user.id = :userId and v.task.id = :taskId")
    // Vote findByUserIdAndTaskId(@Param("userId") Long userId, @Param("taskId") Long taskId);

    // @Query("SELECT COUNT(v.id) from Vote v where v.user.id = :userId")
    // long countByUserId(@Param("userId") Long userId);

    // @Query("SELECT v.task.id FROM Vote v WHERE v.user.id = :userId")
    // Page<Long> findVotedTaskIdsByUserId(@Param("userId") Long userId, Pageable pageable);
}


