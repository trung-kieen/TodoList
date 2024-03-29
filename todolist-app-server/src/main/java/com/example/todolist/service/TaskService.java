package com.example.todolist.service;

import com.example.todolist.exception.BadRequestException;
import com.example.todolist.exception.ResourceNotFoundException;
import com.example.todolist.model.*;
import com.example.todolist.payload.PagedResponse;
import com.example.todolist.payload.TaskRequest;
import com.example.todolist.payload.TaskResponse;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.security.UserPrincipal;
import com.example.todolist.util.AppConstants;
import com.example.todolist.util.ModelMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class TaskService {

  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  private UserService userService;

  private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

  // Get all task not require user role
  public List<Task> getAllTasks() {
    return taskRepository.findAll();
  }

  // Get all task require to have user role
  public PagedResponse<TaskResponse> getAllTasks(UserPrincipal currentUser, int page, int size) {
    validatePageNumberAndSize(page, size);
    // TODO: Custome sort follow due date field
    Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
    Page<Task> tasks = taskRepository.findAll(pageable);

    if (tasks.getNumberOfElements() == 0) {
      return new PagedResponse<>(Collections.emptyList(), tasks.getNumber(),
          tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
    }

    List<TaskResponse> taskResponses = ModelMapper.mapTaskToTaskResponse(tasks);
    return new PagedResponse<>(taskResponses, tasks.getNumber(),
        tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
  }

  public PagedResponse<TaskResponse> getTasksCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
    validatePageNumberAndSize(page, size);
    Long userId = userService.getUserId(username);
    return getAllTaskByUserId(userId, page, size);
  }

  public PagedResponse<TaskResponse> getTasksCreatedBy(String username, int page, int size) {
    validatePageNumberAndSize(page, size);
    Long userId = userService.getUserId(username);
    return getAllTaskByUserId(userId, page, size);
  }

  public PagedResponse<TaskResponse> getTasksCreatedBy(UserPrincipal currentUser, int page, int size) {
    validatePageNumberAndSize(page, size);
    Long userId = currentUser.getId();
    return getAllTaskByUserId(userId, page, size);
  }

  public TaskResponse getTaskById(Long taskId, UserPrincipal currentUser) {
    Task task = taskRepository.findById(taskId).orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
    // User only able to get task they own
    if (!task.getCreatedBy().equals(currentUser.getId())) {
      throw new BadRequestException("User not have role to get this task information");
    } else {
    }
    return ModelMapper.mapTaskToTaskResponse(task);

  }

  public TaskResponse getTaskById(Long taskId) {
    Task task = taskRepository.getById(taskId);
    return ModelMapper.mapTaskToTaskResponse(task);
  }

  public TaskResponse createTask(TaskRequest taskRequest, UserPrincipal currentUser) {
    Task task = ModelMapper.mapTaskRequestToTask(taskRequest);
    task.setCreatedBy(currentUser.getId());
    taskRepository.save(task);
    return ModelMapper.mapTaskToTaskResponse(task);
  }

  public TaskResponse updateTask(TaskRequest taskRequest, UserPrincipal currentUser) {
    Task existingTask = this.taskRepository.findById((taskRequest.getId()))
        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskRequest.getId()));
    if (!existingTask.getCreatedBy().equals(currentUser.getId())) {
      throw new BadRequestException("Current user not own this task");
    }
    existingTask.setId((taskRequest.getId()));
    existingTask.setTitle(taskRequest.getTitle());
    existingTask.setNote((taskRequest.getNote()));
    existingTask.setDue(taskRequest.getDue());
    existingTask.setPriority(taskRequest.getPriority());
    existingTask.setCompleted(taskRequest.getCompleted());
    taskRepository.save(existingTask);
    return ModelMapper.mapTaskToTaskResponse(existingTask);
  }

  public void deleteTask(TaskRequest taskRequest, UserPrincipal currentUser) {
    deleteTaskById(taskRequest.getId(), currentUser);
  }

  public void deleteTaskById(Long taskId, UserPrincipal currentUser) {
    Task existingTask = this.taskRepository.findById((taskId))
        .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
    if (!existingTask.getCreatedBy().equals(currentUser.getId())) {
      throw new BadRequestException("Current user not own this task");
    }
    taskRepository.delete(existingTask);
  }
  // =================> Helper <===================

  private void validatePageNumberAndSize(int page, int size) {
    if (page < 0) {
      throw new BadRequestException("Page number cannot be less than zero.");
    }

    if (size > AppConstants.MAX_PAGE_SIZE) {
      throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
    }
  }

  private PagedResponse<TaskResponse> getAllTaskByUserId(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "due");
    Page<Task> tasks = taskRepository.findByCreatedBy(userId, pageable);

    List<TaskResponse> taskResponses;
    if (tasks.getNumberOfElements() == 0) {
      taskResponses = Collections.emptyList();
    } else {
      // Map Tasks to TaskResponses containing vote counts and task creator details
      taskResponses = tasks.map(task -> {
        return ModelMapper.mapTaskToTaskResponse(task);
      }).getContent();
    }
    return new PagedResponse<>(taskResponses, tasks.getNumber(),
        tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());

  }
}
