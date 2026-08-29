package com.example.task_management_project.service;

import com.example.task_management_project.dto.TaskRequestDTO;
import com.example.task_management_project.dto.TaskResponseDTO;
import com.example.task_management_project.entity.Task;
import com.example.task_management_project.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    // Get all task
    public List<Task> getAllTask(){
        return taskRepository.findAll();
    }

    // Get task by Id
    public Task getTaskById(Long id){
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found with Id: "+id));
    }

    // Create new task
    public Task createTask(Task task){
        return taskRepository.save(task);
    }

    // Update task
    public Task updateTask(Long id, Task taskDetails){
        Task existingTask = getTaskById(id);

        existingTask.setTitle(taskDetails.getTitle());
        existingTask.setDescription(taskDetails.getDescription());

        existingTask.setCompleted(taskDetails.isCompleted());

        existingTask.setCategory(taskDetails.getCategory());
        existingTask.setTags(taskDetails.getTags());

        return taskRepository.save(existingTask);
    }

    // Delete task
    public void deleteTask(Long id) {
        Task existingTask = getTaskById(id);
        taskRepository.delete(existingTask);
    }

    // Mapping Entity to DTO
    public TaskResponseDTO mapToResponseDTO(Task task){
        TaskResponseDTO responseDTO = new TaskResponseDTO();

        responseDTO.setId(task.getId());
        responseDTO.setTitle(task.getTitle());
        responseDTO.setDescription(task.getDescription());
        responseDTO.setCompleted(task.isCompleted());
        responseDTO.setDueDate(task.getDueDate());

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Task mapToEntity(TaskRequestDTO requestDTO){
        Task task = new Task();

        task.setTitle(requestDTO.getTitle());
        task.setDescription(requestDTO.getDescription());
        task.setDueDate(requestDTO.getDueDate());

        return task;
    }
}
