package com.example.todolist.controller;

import com.example.todolist.model.*;
import com.example.todolist.payload.*;
// import com.example.todolist.repository.TaskRepository;
import com.example.todolist.repository.UserRepository;
// import com.example.todolist.repository.VoteRepository;
import com.example.todolist.security.CurrentUser;
import com.example.todolist.security.UserPrincipal;
import com.example.todolist.service.TaskService;
import com.example.todolist.util.AppConstants;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  @Autowired
  private TaskService taskService;

  private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

  @GetMapping
  public PagedResponse<TaskResponse> getTasks(@CurrentUser UserPrincipal currentUser,
      @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
      @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
    return taskService.getTasksCreatedBy(currentUser, page, size);
  }

  @PostMapping
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> createTask(@CurrentUser UserPrincipal currentUser,
      @Valid @RequestBody TaskRequest taskRequest) {
    TaskResponse task = taskService.createTask(taskRequest, currentUser);
    return ResponseEntity.ok(task);
  }

  @GetMapping("/{taskId}")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<TaskResponse> getTaskById(@CurrentUser UserPrincipal currentUser,
      @PathVariable Long taskId) {
    return ResponseEntity.ok(taskService.getTaskById(taskId, currentUser));
  }

  @PutMapping
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> updateTask(@CurrentUser UserPrincipal currentUser,
      @Valid @RequestBody TaskRequest taskRequest) {
    return ResponseEntity.ok(taskService.updateTask(taskRequest, currentUser));
  }

  @DeleteMapping("/{taskId}")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> deleteTask(@CurrentUser UserPrincipal currentUser,
      @PathVariable Long taskId) {
    taskService.deleteTaskById(taskId, currentUser);
    return ResponseEntity.ok("Delete task success");
  }

  @DeleteMapping
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<?> deleteTask(@CurrentUser UserPrincipal currentUser,
      @Valid @RequestBody TaskRequest taskRequest) {
    taskService.deleteTask(taskRequest, currentUser);
    return ResponseEntity.ok("Delete task success");
  }

}
