package com.example.todolist.service;

import com.example.todolist.exception.BadRequestException;
import com.example.todolist.exception.ResourceNotFoundException;
import com.example.todolist.model.*;
import com.example.todolist.payload.PagedResponse;
import com.example.todolist.payload.TaskRequest;
import com.example.todolist.payload.TaskResponse;
// import com.example.todolist.payload.VoteRequest;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.repository.UserRepository;
// import com.example.todolist.repository.VoteRepository;
import com.example.todolist.security.UserPrincipal;
import com.example.todolist.util.AppConstants;
import com.example.todolist.util.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // @Autowired
    // private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    public PagedResponse<TaskResponse> getAllTasks(UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        // Retrieve Tasks
        // TODO: Custome sort follow due date field
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Task> tasks = taskRepository.findAll(pageable);

        if(tasks.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), tasks.getNumber(),
                    tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
        }

        // Map Tasks to TaskResponses containing vote counts and task creator details
        List<Long> taskIds = tasks.map(Task::getId).getContent();
        Map<Long, Long> choiceVoteCountMap = getChoiceVoteCountMap(taskIds);
        Map<Long, Long> taskUserVoteMap = getTaskUserVoteMap(currentUser, taskIds);
        Map<Long, User> creatorMap = getTaskCreatorMap(tasks.getContent());

        List<TaskResponse> taskResponses = tasks.map(task -> {
            return ModelMapper.mapTaskToTaskResponse(task,
                    choiceVoteCountMap,
                    creatorMap.get(task.getCreatedBy()),
                    taskUserVoteMap == null ? null : taskUserVoteMap.getOrDefault(task.getId(), null));
        }).getContent();

        return new PagedResponse<>(taskResponses, tasks.getNumber(),
                tasks.getSize(), tasks.getTotalElements(), tasks.getTotalPages(), tasks.isLast());
    }

    public PagedResponse<TaskResponse> getTasksCreatedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all todolist created by the given username
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Task> todolist = taskRepository.findByCreatedBy(user.getId(), pageable);

        if (todolist.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), todolist.getNumber(),
                    todolist.getSize(), todolist.getTotalElements(), todolist.getTotalPages(), todolist.isLast());
        }

        // Map Tasks to TaskResponses containing vote counts and task creator details
        List<Long> taskIds = todolist.map(Task::getId).getContent();
        Map<Long, Long> choiceVoteCountMap = getChoiceVoteCountMap(taskIds);
        Map<Long, Long> taskUserVoteMap = getTaskUserVoteMap(currentUser, taskIds);

        List<TaskResponse> taskResponses = todolist.map(task -> {
            return ModelMapper.mapTaskToTaskResponse(task,
                    choiceVoteCountMap,
                    user,
                    taskUserVoteMap == null ? null : taskUserVoteMap.getOrDefault(task.getId(), null));
        }).getContent();

        return new PagedResponse<>(taskResponses, todolist.getNumber(),
                todolist.getSize(), todolist.getTotalElements(), todolist.getTotalPages(), todolist.isLast());
    }

    public PagedResponse<TaskResponse> getTasksVotedBy(String username, UserPrincipal currentUser, int page, int size) {
        validatePageNumberAndSize(page, size);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Retrieve all taskIds in which the given username has voted
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "createdAt");
        Page<Long> userVotedTaskIds = voteRepository.findVotedTaskIdsByUserId(user.getId(), pageable);

        if (userVotedTaskIds.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), userVotedTaskIds.getNumber(),
                    userVotedTaskIds.getSize(), userVotedTaskIds.getTotalElements(),
                    userVotedTaskIds.getTotalPages(), userVotedTaskIds.isLast());
        }

        // Retrieve all task details from the voted taskIds.
        List<Long> taskIds = userVotedTaskIds.getContent();

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        List<Task> todolist = taskRepository.findByIdIn(taskIds, sort);

        // Map Tasks to TaskResponses containing vote counts and task creator details
        Map<Long, Long> choiceVoteCountMap = getChoiceVoteCountMap(taskIds);
        Map<Long, Long> taskUserVoteMap = getTaskUserVoteMap(currentUser, taskIds);
        Map<Long, User> creatorMap = getTaskCreatorMap(todolist);

        List<TaskResponse> taskResponses = todolist.stream().map(task -> {
            return ModelMapper.mapTaskToTaskResponse(task,
                    choiceVoteCountMap,
                    creatorMap.get(task.getCreatedBy()),
                    taskUserVoteMap == null ? null : taskUserVoteMap.getOrDefault(task.getId(), null));
        }).collect(Collectors.toList());

        return new PagedResponse<>(taskResponses, userVotedTaskIds.getNumber(), userVotedTaskIds.getSize(), userVotedTaskIds.getTotalElements(), userVotedTaskIds.getTotalPages(), userVotedTaskIds.isLast());
    }


    public Task createTask(TaskRequest taskRequest) {
        Task task = new Task();
        task.setQuestion(taskRequest.getQuestion());

        taskRequest.getChoices().forEach(choiceRequest -> {
            task.addChoice(new Choice(choiceRequest.getText()));
        });

        Instant now = Instant.now();
        Instant expirationDateTime = now.plus(Duration.ofDays(taskRequest.getTaskLength().getDays()))
                .plus(Duration.ofHours(taskRequest.getTaskLength().getHours()));

        task.setExpirationDateTime(expirationDateTime);

        return taskRepository.save(task);
    }

    public TaskResponse getTaskById(Long taskId, UserPrincipal currentUser) {
        Task task = taskRepository.findById(taskId).orElseThrow(
                () -> new ResourceNotFoundException("Task", "id", taskId));

        // Retrieve Vote Counts of every choice belonging to the current task
        List<ChoiceVoteCount> votes = voteRepository.countByTaskIdGroupByChoiceId(taskId);

        Map<Long, Long> choiceVotesMap = votes.stream()
                .collect(Collectors.toMap(ChoiceVoteCount::getChoiceId, ChoiceVoteCount::getVoteCount));

        // Retrieve task creator details
        User creator = userRepository.findById(task.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", task.getCreatedBy()));

        // Retrieve vote done by logged in user
        Vote userVote = null;
        if(currentUser != null) {
            userVote = voteRepository.findByUserIdAndTaskId(currentUser.getId(), taskId);
        }

        return ModelMapper.mapTaskToTaskResponse(task, choiceVotesMap,
                creator, userVote != null ? userVote.getChoice().getId(): null);
    }

    public TaskResponse castVoteAndGetUpdatedTask(Long taskId, VoteRequest voteRequest, UserPrincipal currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        if(task.getExpirationDateTime().isBefore(Instant.now())) {
            throw new BadRequestException("Sorry! This Task has already expired");
        }

        User user = userRepository.getOne(currentUser.getId());

        Choice selectedChoice = task.getChoices().stream()
                .filter(choice -> choice.getId().equals(voteRequest.getChoiceId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", voteRequest.getChoiceId()));

        Vote vote = new Vote();
        vote.setTask(task);
        vote.setUser(user);
        vote.setChoice(selectedChoice);

        try {
            vote = voteRepository.save(vote);
        } catch (DataIntegrityViolationException ex) {
            logger.info("User {} has already voted in Task {}", currentUser.getId(), taskId);
            throw new BadRequestException("Sorry! You have already cast your vote in this task");
        }

        //-- Vote Saved, Return the updated Task Response now --

        // Retrieve Vote Counts of every choice belonging to the current task
        List<ChoiceVoteCount> votes = voteRepository.countByTaskIdGroupByChoiceId(taskId);

        Map<Long, Long> choiceVotesMap = votes.stream()
                .collect(Collectors.toMap(ChoiceVoteCount::getChoiceId, ChoiceVoteCount::getVoteCount));

        // Retrieve task creator details
        User creator = userRepository.findById(task.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", task.getCreatedBy()));

        return ModelMapper.mapTaskToTaskResponse(task, choiceVotesMap, creator, vote.getChoice().getId());
    }


    private void validatePageNumberAndSize(int page, int size) {
        if(page < 0) {
            throw new BadRequestException("Page number cannot be less than zero.");
        }

        if(size > AppConstants.MAX_PAGE_SIZE) {
            throw new BadRequestException("Page size must not be greater than " + AppConstants.MAX_PAGE_SIZE);
        }
    }

    private Map<Long, Long> getChoiceVoteCountMap(List<Long> taskIds) {
        // Retrieve Vote Counts of every Choice belonging to the given taskIds
        List<ChoiceVoteCount> votes = voteRepository.countByTaskIdInGroupByChoiceId(taskIds);

        Map<Long, Long> choiceVotesMap = votes.stream()
                .collect(Collectors.toMap(ChoiceVoteCount::getChoiceId, ChoiceVoteCount::getVoteCount));

        return choiceVotesMap;
    }

    private Map<Long, Long> getTaskUserVoteMap(UserPrincipal currentUser, List<Long> taskIds) {
        // Retrieve Votes done by the logged in user to the given taskIds
        Map<Long, Long> taskUserVoteMap = null;
        if(currentUser != null) {
            List<Vote> userVotes = voteRepository.findByUserIdAndTaskIdIn(currentUser.getId(), taskIds);

            taskUserVoteMap = userVotes.stream()
                    .collect(Collectors.toMap(vote -> vote.getTask().getId(), vote -> vote.getChoice().getId()));
        }
        return taskUserVoteMap;
    }

    Map<Long, User> getTaskCreatorMap(List<Task> todolist) {
        // Get Task Creator details of the given list of todolist
        List<Long> creatorIds = todolist.stream()
                .map(Task::getCreatedBy)
                .distinct()
                .collect(Collectors.toList());

        List<User> creators = userRepository.findByIdIn(creatorIds);
        Map<Long, User> creatorMap = creators.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        return creatorMap;
    }
}
