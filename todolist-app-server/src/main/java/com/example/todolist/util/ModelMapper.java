package com.example.todolist.util;

import com.example.todolist.model.Task;
import com.example.todolist.model.User;
import com.example.todolist.payload.TaskRequest;
import com.example.todolist.payload.TaskResponse;
import com.example.todolist.payload.UserSummary;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ModelMapper {

    // TODO: Refactor this file

    public static TaskResponse mapTaskToTaskResponse(Task task) {
        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setId(task.getId());
        taskResponse.setTitle(task.getTitle());
        // taskResponse.setCreateAt(task.getCreatedAt());
        taskResponse.setDue(task.getDue());
        taskResponse.setPriority(task.getPriority());
        taskResponse.setCompleted(task.getCompleted());
        taskResponse.setNote(task.getNote());

        // Instant now = Instant.now();
        // taskResponse.setExpired(task.getExpirationDateTime().isBefore(now));
        // TODO: add more property for time left of task  with current


        return taskResponse;
    }

    public static  Task mapTaskRequestToTask(TaskRequest taskRequest){

    Task task = new Task();
    task.setTitle(taskRequest.getTitle());
    task.setDue(taskRequest.getDue());
    task.setNote(taskRequest.getNote());
    task.setPriority(taskRequest.getPriority());
    task.setCompleted(taskRequest.getCompleted());
    return task;
    }

}
