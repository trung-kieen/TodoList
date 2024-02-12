package com.example.todolist.controller;

import com.example.todolist.model.*;
import com.example.todolist.payload.*;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.repository.UserRepository;
// import com.example.todolist.repository.VoteRepository;
import com.example.todolist.security.CurrentUser;
import com.example.todolist.security.UserPrincipal;
import com.example.todolist.service.TaskService;
import com.example.todolist.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    private TaskRepository taskRepository;

    // @Autowired
    // private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskService taskService;

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @GetMapping
    public PagedResponse<TaskResponse> getTasks(@CurrentUser UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return taskService.getAllTasks(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        Task task = taskService.createTask(taskRequest);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{taskId}")
                .buildAndExpand(task.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "Task Created Successfully"));
    }

    @GetMapping("/{taskId}")
    public TaskResponse getTaskById(@CurrentUser UserPrincipal currentUser,
            @PathVariable Long taskId) {
        return taskService.getTaskById(taskId, currentUser);
    }

    // TODO: Reduce this router
    // @PostMapping("/{taskId}/votes")
    // @PreAuthorize("hasRole('USER')")
    // public TaskResponse castVote(@CurrentUser UserPrincipal currentUser,
    //         @PathVariable Long taskId,
    //         @Valid @RequestBody VoteRequest voteRequest) {
    //     return taskService.castVoteAndGetUpdatedTask(taskId, voteRequest, currentUser);
    // }

}
