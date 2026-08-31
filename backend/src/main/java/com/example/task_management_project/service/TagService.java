package com.example.task_management_project.service;

import com.example.task_management_project.dto.TagRequestDTO;
import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.entity.Tag;
import com.example.task_management_project.entity.Task;
import com.example.task_management_project.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    // Get all tag
    public List<TagResponseDTO> getAllTags() {
        return tagRepository.findAllTagsWithTaskCount();
    }

    // Create new tag
    public TagResponseDTO createTag(TagRequestDTO requestDTO) {
        Tag newTag = mapToEntity(requestDTO);
        Tag createdTag = tagRepository.save(newTag);

        return mapToResponseDTO(createdTag);
    }

    // Update tag
    public TagResponseDTO updateTag(Long id, TagRequestDTO requestDTO) {
        Tag existingTag = getTagById(id);
        existingTag.setName(requestDTO.getName());
        existingTag.setColor(requestDTO.getColor());

        Tag updatedTag = tagRepository.save(existingTag);
        return mapToResponseDTO(updatedTag);
    }

    // Delete tag
    public void deleteTag(Long id) {
        Tag existingTag = getTagById(id);
        tagRepository.delete(existingTag);
    }

    // Get tag by Id
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
    }

    // Mapping Entity to DTO
    public TagResponseDTO mapToResponseDTO(Tag tag){
        TagResponseDTO responseDTO = new TagResponseDTO();

        responseDTO.setId(tag.getId());
        responseDTO.setName(tag.getName());
        responseDTO.setColor(tag.getColor());
        responseDTO.setCount(0L);

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Tag mapToEntity(TagRequestDTO requestDTO){
        Tag tag = new Tag();
        tag.setName(requestDTO.getName());
        tag.setColor(requestDTO.getColor());

        return tag;
    }
}