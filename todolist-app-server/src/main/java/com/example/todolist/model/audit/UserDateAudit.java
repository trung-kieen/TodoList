package com.example.todolist.model.audit;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;

import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;



@MappedSuperclass
@JsonIgnoreProperties(
        value = {"createdBy" },
        allowGetters = true
)
public abstract class UserDateAudit extends DateAudit {


    @CreatedBy
    private Long createdBy;


    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

}
