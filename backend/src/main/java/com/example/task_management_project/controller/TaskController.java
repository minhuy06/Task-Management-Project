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
        List<TaskResponseDTO> responseDTOS = taskService.getAllTask();
        return ResponseEntity.ok(responseDTOS);
    }

    // Get task by id
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id){
        TaskResponseDTO responseDTO = taskService.getTaskById(id);
        return ResponseEntity.ok(responseDTO);
    }

    // Create new task
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskRequestDTO requestDTO){
        TaskResponseDTO responseDTO = taskService.createTask(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO requestDTO){
        TaskResponseDTO responseDTO = taskService.updateTask(id, requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
