package com.example.task_management_project.controller;

import com.example.task_management_project.dto.TaskRequestDTO;
import com.example.task_management_project.dto.TaskResponseDTO;
import com.example.task_management_project.entity.Task;
import com.example.task_management_project.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    // Get all task
    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTask(){

        List<TaskResponseDTO> responseDTOS = taskService.getAllTask()
                .stream()
                .map(taskService::mapToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    // Get task by id
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id){
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(taskService.mapToResponseDTO(task));
    }

    // Create new task
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskRequestDTO requestDTO){
        Task task = taskService.mapToEntity(requestDTO);
        Task savedTask = taskService.createTask(task);

        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.mapToResponseDTO(savedTask));
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO requestDTO){
        Task taskDetail = taskService.mapToEntity(requestDTO);
        Task updatedTask = taskService.updateTask(id, taskDetail);

        return ResponseEntity.ok(taskService.mapToResponseDTO(updatedTask));
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
