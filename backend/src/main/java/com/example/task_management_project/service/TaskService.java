package com.example.task_management_project.service;

import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.dto.TaskRequestDTO;
import com.example.task_management_project.dto.TaskResponseDTO;
import com.example.task_management_project.entity.Category;
import com.example.task_management_project.entity.Tag;
import com.example.task_management_project.entity.Task;
import com.example.task_management_project.enums.TaskStatus;
import com.example.task_management_project.repository.CategoryRepository;
import com.example.task_management_project.repository.TagRepository;
import com.example.task_management_project.repository.TaskRepository;
import jakarta.persistence.criteria.Join;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository, TagRepository tagRepository){
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    // task filter
    public List<TaskResponseDTO> filterTasks(String search, String category, TaskStatus status, String tag){
        Specification<Task> spec = (root, query, cb) -> cb.conjunction();

        if(search != null && !search.trim().isEmpty()){
            spec = spec.and((root, query, cb) -> {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                );
            });
        }

        if(category != null && !category.trim().isEmpty()){
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.join("category").get("name"), category)
            );
        }

        if(status != null){
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status)
            );
        }

        if(tag != null && !tag.trim().isEmpty()){
            spec = spec.and((root, query, cb) -> {
                Join<Task, Tag> tagsJoin = root.join("tags");
                return cb.equal(tagsJoin.get("name"), tag);
            });
        }

        List<Task> tasks = taskRepository.findAll(spec);

        return tasks.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    // Get all task
    public List<TaskResponseDTO> getAllTask(){
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get task by id
    public TaskResponseDTO getTaskById(Long id){
        Task task = getTaskEntityById(id);
        return mapToResponseDTO(task);
    }

    // Create new task
    public TaskResponseDTO createTask(TaskRequestDTO requestDTO){
        Task newTask = mapToEntity(requestDTO);
        newTask.setStatus(TaskStatus.PENDING);
        Task createdTask = taskRepository.save(newTask);

        return mapToResponseDTO(createdTask);
    }

    // update TaskStatus
    public TaskResponseDTO updateTaskStatus(Long id, TaskStatus newStatus){
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        return mapToResponseDTO(updatedTask);
    }

    // Update task
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO requestDTO){
        Task existingTask = getTaskEntityById(id);

        existingTask.setTitle(requestDTO.getTitle());
        existingTask.setDescription(requestDTO.getDescription());
        existingTask.setDueDate(requestDTO.getDueDate());

        // Update new category
        if(requestDTO.getCategoryId() != null ){
            Category category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            existingTask.setCategory(category);
        }

        // Update new tags
        if(requestDTO.getTagIds() != null && !requestDTO.getTagIds().isEmpty()){
            List<Tag> tags = tagRepository.findAllById(requestDTO.getTagIds());
            existingTask.setTags(tags);
        }
        else{
            existingTask.setTags(null);
        }

        Task updatedTask = taskRepository.save(existingTask);
        return mapToResponseDTO(updatedTask);
    }

    // Delete task
    public void deleteTask(Long id) {
        Task existingTask = getTaskEntityById(id);
        taskRepository.delete(existingTask);
    }

    // Get task by Id (internal)
    public Task getTaskEntityById(Long id){
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found with Id: "+id));
    }

    // Mapping Entity to DTO
    public TaskResponseDTO mapToResponseDTO(Task task){
        TaskResponseDTO responseDTO = new TaskResponseDTO();

        responseDTO.setId(task.getId());
        responseDTO.setTitle(task.getTitle());
        responseDTO.setDescription(task.getDescription());
        responseDTO.setStatus(task.getStatus());
        responseDTO.setDueDate(task.getDueDate());

        if(task.getCategory() != null){
            CategoryResponseDTO categoryResponseDTO = new CategoryResponseDTO();
            categoryResponseDTO.setId(task.getCategory().getId());
            categoryResponseDTO.setName(task.getCategory().getName());
            categoryResponseDTO.setCount(0L);

            responseDTO.setCategoryResponseDTO(categoryResponseDTO);
        }

        if(task.getTags() != null){
            List<TagResponseDTO> tagResponseDTOS = task.getTags().stream().map(tag -> {
                TagResponseDTO tagResponseDTO = new TagResponseDTO();
                tagResponseDTO.setId(tag.getId());
                tagResponseDTO.setName(tag.getName());
                tagResponseDTO.setColor(tag.getColor());
                tagResponseDTO.setCount(0L);
                return tagResponseDTO;
            }).collect(Collectors.toList());

            responseDTO.setTagResponseDTOS(tagResponseDTOS);
        }

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Task mapToEntity(TaskRequestDTO requestDTO){
        Task task = new Task();

        task.setTitle(requestDTO.getTitle());
        task.setDescription(requestDTO.getDescription());
        task.setDueDate(requestDTO.getDueDate());
        task.setStatus(requestDTO.getStatus());

        // Get category entity by categoryId
        if(requestDTO.getCategoryId() != null){
            Category category = categoryRepository.findById(requestDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            task.setCategory(category);
        }

        // Get list<Tag> by list<tagId>
        if(requestDTO.getTagIds() != null && !requestDTO.getTagIds().isEmpty()){
            List<Tag> tags = tagRepository.findAllById(requestDTO.getTagIds());
            task.setTags(tags);
        }

        return task;
    }
}
