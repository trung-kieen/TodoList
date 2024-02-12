package com.example.todolist.util;

import com.example.todolist.model.Task;
import com.example.todolist.model.User;
import com.example.todolist.payload.ChoiceResponse;
import com.example.todolist.payload.TaskResponse;
import com.example.todolist.payload.UserSummary;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ModelMapper {

    public static TaskResponse mapTaskToTaskResponse(Task task, Map<Long, Long> choiceVotesMap, User creator, Long userVote) {
        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setId(task.getId());
        taskResponse.setQuestion(task.getQuestion());
        taskResponse.setCreationDateTime(task.getCreatedAt());
        taskResponse.setExpirationDateTime(task.getExpirationDateTime());
        Instant now = Instant.now();
        taskResponse.setExpired(task.getExpirationDateTime().isBefore(now));

        List<ChoiceResponse> choiceResponses = task.getChoices().stream().map(choice -> {
            ChoiceResponse choiceResponse = new ChoiceResponse();
            choiceResponse.setId(choice.getId());
            choiceResponse.setText(choice.getText());

            if(choiceVotesMap.containsKey(choice.getId())) {
                choiceResponse.setVoteCount(choiceVotesMap.get(choice.getId()));
            } else {
                choiceResponse.setVoteCount(0);
            }
            return choiceResponse;
        }).collect(Collectors.toList());

        taskResponse.setChoices(choiceResponses);
        UserSummary creatorSummary = new UserSummary(creator.getId(), creator.getUsername(), creator.getName());
        taskResponse.setCreatedBy(creatorSummary);

        if(userVote != null) {
            taskResponse.setSelectedChoice(userVote);
        }

        long totalVotes = taskResponse.getChoices().stream().mapToLong(ChoiceResponse::getVoteCount).sum();
        taskResponse.setTotalVotes(totalVotes);

        return taskResponse;
    }

}
