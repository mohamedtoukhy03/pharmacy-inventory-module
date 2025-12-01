package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.CategoryDto;
import com.pharmacyerp.inventory.dto.UpsertCategoryRequest;
import com.pharmacyerp.inventory.entity.Category;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> search(String name) {
        List<Category> categories;
        if (name == null || name.isBlank()) {
            categories = categoryRepository.findAll();
        } else {
            categories = categoryRepository.findByNameContainingIgnoreCase(name);
        }
        return categories.stream()
                .map(this::toDto)
                .toList();
    }

    public CategoryDto create(UpsertCategoryRequest request) {
        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());
        return toDto(categoryRepository.save(category));
    }

    public CategoryDto update(Integer id, UpsertCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
        category.setName(request.name());
        category.setDescription(request.description());
        return toDto(category);
    }

    public void delete(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
}


