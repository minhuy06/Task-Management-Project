package com.example.task_management_project.dto;

import com.example.task_management_project.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private CategoryResponseDTO categoryResponseDTO;
    private List<TagResponseDTO> tagResponseDTOS;
}
