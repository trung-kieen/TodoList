package com.example.todolist.payload;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public class TaskRequest {
  private Long id;
  @NotBlank
  @Size(max = 140)
  @Valid
  private String title;

  @Size(max = 140)
  @Valid
  private String note;


  // TODO: Valid due is future ???
  private Instant due;


  private int priority;


  private Boolean completed;




  public void setId(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getTitle() {
    return title;
  }

  public void setNote(String note) {
    this.note = note;
  }

  public String getNote() {
    return note;
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

  public Instant getDue() {
    return due;
  }

  public void setDue(Instant due) {
    this.due = due;
  }

}
