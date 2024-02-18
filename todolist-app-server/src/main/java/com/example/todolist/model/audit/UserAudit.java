package com.example.todolist.model.audit;

import java.io.Serializable;

import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import org.springframework.data.annotation.CreatedBy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * UserAudit
 */

@MappedSuperclass
@JsonIgnoreProperties(value = { "createdBy" }, allowGetters = true)

public abstract class UserAudit implements Serializable {

  @CreatedBy
  private Long createdBy;

  public Long getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(Long createdBy) {
    this.createdBy = createdBy;
  }

}
