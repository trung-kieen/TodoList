package com.example.todolist.model;

import com.example.todolist.model.audit.UserAudit;
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
public class Task extends UserAudit  {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  @NotBlank
  @Size(max = 140)
  private String title;

  @Column
  @NotBlank
  @Size(max = 140)
  private String note;


  @Column
  private Instant due;

  @Column
  private int priority;

  @Column(columnDefinition = "boolean default false")
  private Boolean completed;



  // TODO: label is additional feature develop later

  // @ManyToOne(fetch = FetchType.LAZY  , optional =  false)
  // @JoinColumn(name =  "label_id", nullable =  false)
  // private Label label;

  // NOTE: those column is deplicate because Task inheritance from
  // UserDateAudit class that specify which user create task

  // @ManyToOne(fetch = FetchType.LAZY  , optional =  false)
  // @JoinColumn(name =  "user_id", nullable =  false)
  // private User user;
  // public User getUser() {
  //   return user;
  // }
  // public void setUser(User user) {
  //   this.user = user;
  // }

  public Task(){
  }
  public Task(String title, String note, Instant due , int  priority , Boolean completed){
    this.title  = title;
    this.due  = due;
    this.priority = priority;
    this.completed  = completed;
  }

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
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


}
