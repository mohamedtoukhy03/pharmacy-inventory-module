package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.CategoryDto;
import com.pharmacyerp.inventory.dto.UpsertCategoryRequest;
import com.pharmacyerp.inventory.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDto> searchCategories(
            @RequestParam(value = "name", required = false) String name) {
        return categoryService.search(name);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto createCategory(@Valid @RequestBody UpsertCategoryRequest request) {
        return categoryService.create(request);
    }

    @PatchMapping("/{catId}")
    public CategoryDto updateCategory(@PathVariable Integer catId,
                                      @Valid @RequestBody UpsertCategoryRequest request) {
        return categoryService.update(catId, request);
    }

    @DeleteMapping("/{catId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Integer catId) {
        categoryService.delete(catId);
    }
}


