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
        return taskService.getAllTasks(currentUser, page, size);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createTask(@CurrentUser UserPrincipal currentUser, @Valid @RequestBody TaskRequest taskRequest) {
        TaskResponse task = taskService.createTask(taskRequest, currentUser);
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

    // NOTE: for debug only, remove me on product
    // @GetMapping("/all")
    // public List<Task> getAllTasks(){
    //   return taskService.getAllTasks();
    // }


}
