package com.example.task_management_project.controller;

import com.example.task_management_project.dto.TaskRequestDTO;
import com.example.task_management_project.dto.TaskResponseDTO;
import com.example.task_management_project.enums.TaskStatus;
import com.example.task_management_project.security.CustomUserDetails;
import com.example.task_management_project.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getTasksByQuery(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String tag
    ){
        Long userId = getCurrentUserId();
        List<TaskResponseDTO> responseDTOS = taskService.filterTasks(search, category, status, tag, userId);
        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id){
        Long userId = getCurrentUserId();
        TaskResponseDTO responseDTO = taskService.getTaskById(id, userId);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskRequestDTO requestDTO){
        Long userId = getCurrentUserId();
        TaskResponseDTO responseDTO = taskService.createTask(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO requestDTO){
        Long userId = getCurrentUserId(); // Lấy ID
        TaskResponseDTO responseDTO = taskService.updateTask(id, requestDTO, userId);
        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate){
        String statusString = statusUpdate.get("status");
        TaskStatus newStatus = TaskStatus.valueOf(statusString);
        Long userId = getCurrentUserId(); // Lấy ID

        TaskResponseDTO updatedTask = taskService.updateTaskStatus(id, newStatus, userId);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        Long userId = getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }
}