package com.example.task_management_project.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskRequestDTO {
    private String title;
    private String description;
    private LocalDateTime dueDate;
}
