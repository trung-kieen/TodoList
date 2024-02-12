package com.example.todolist.model;

import com.example.todolist.model.audit.DateAudit;
import com.example.todolist.model.audit.UserDateAudit;
import com.sun.istack.NotNull;

import net.bytebuddy.implementation.bind.annotation.Default;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {
        "task_id",
        "user_id"
    })
})
public class Label extends UserDateAudit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  @NotBlank
  private String name;

  // TODO: Change with default value enum
  @Column
  @NotBlank
  private String color;



  // NOTE: those column is deplicate because Label inheritance from
  // UserDateAudit class that specify which user create task

  // @ManyToOne(fetch = FetchType.LAZY, optional = false)
  // @JoinColumn(name = "user_id", nullable = false)
  // private User user;

  public Label(String name, String color) {
    this.name = name;
    this.color = color;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public String getColor() {
    return color;
  }

}
