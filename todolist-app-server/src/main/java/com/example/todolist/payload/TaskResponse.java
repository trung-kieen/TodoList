package com.example.todolist.payload;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.*;

public class TaskResponse {

  private Long id;

  @NotBlank
  private String title;

  @NotBlank
  private String note;

  private Instant due;

  private int priority;

  private Boolean completed;



  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  public String getNote() {
    return note;
  }
  public void setNote(String note) {
    this.note = note;
  }
  public Instant getDue() {
    return due;
  }
  public void setDue(Instant due) {
    this.due = due;
  }
  public int getPriority() {
    return priority;
  }
  public void setPriority(int priority) {
    this.priority = priority;
  }

  public Boolean getCompleted() {
    return completed;
  }
  public void setCompleted(Boolean completed) {
    this.completed = completed;
  }

}
