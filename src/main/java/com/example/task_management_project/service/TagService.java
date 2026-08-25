package com.example.task_management_project.service;

import com.example.task_management_project.entity.Tag;
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
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    // Get tag by Id
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
    }

    // Create new tag
    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    // Update tag
    public Tag updateTag(Long id, Tag tagDetails) {
        Tag existingTag = getTagById(id);
        existingTag.setName(tagDetails.getName());

        return tagRepository.save(existingTag);
    }

    // Delete tag
    public void deleteTag(Long id) {
        Tag existingTag = getTagById(id);
        tagRepository.delete(existingTag);
    }
}