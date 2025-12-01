package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.CategoryDto;
import com.pharmacyerp.inventory.dto.UpsertCategoryRequest;
import com.pharmacyerp.inventory.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Categories", description = "Endpoints for managing product categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    @Operation(summary = "Search categories by optional name filter")
    public List<CategoryDto> searchCategories(
            @RequestParam(value = "name", required = false) String name) {
        return categoryService.search(name);
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDto createCategory(@Valid @RequestBody UpsertCategoryRequest request) {
        return categoryService.create(request);
    }

    @PatchMapping("/{catId}")
    @Operation(summary = "Update an existing category")
    public CategoryDto updateCategory(@PathVariable Integer catId,
                                      @Valid @RequestBody UpsertCategoryRequest request) {
        return categoryService.update(catId, request);
    }

    @DeleteMapping("/{catId}")
    @Operation(summary = "Delete a category by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Integer catId) {
        categoryService.delete(catId);
    }
}


