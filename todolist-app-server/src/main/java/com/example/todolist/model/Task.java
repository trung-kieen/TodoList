package com.example.todolist.model;

import com.example.todolist.model.audit.UserDateAudit;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task extends UserDateAudit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 140)
  private String title;

  @NotBlank
  @Size(max = 140)
  private String note;

  @NotNull
  private Instant expirationDateTime;

  private Instant due;

  private int priority;

  private Boolean done;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  public Long getId() {
    return id;
  }

  public int getPriority() {
    return priority;
  }

  public void setPriority(int priority) {
    this.priority = priority;
  }

  public Boolean getDone() {
    return done;
  }

  public void setDone(Boolean done) {
    this.done = done;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Instant getExpirationDateTime() {
    return expirationDateTime;
  }

  public void setExpirationDateTime(Instant expirationDateTime) {
    this.expirationDateTime = expirationDateTime;
  }

  public Instant getDue() {
    return due;
  }

  public void setDue(Instant due) {
    this.due = due;
  }

}
