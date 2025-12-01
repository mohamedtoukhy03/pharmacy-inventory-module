package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.IngredientDto;
import com.pharmacyerp.inventory.dto.UpsertIngredientRequest;
import com.pharmacyerp.inventory.service.IngredientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ingredients")
@Tag(name = "Ingredients", description = "Endpoints for managing reference ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    @Operation(summary = "Search ingredients by optional name and active flag")
    public List<IngredientDto> searchIngredients(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "active", required = false) Boolean active) {
        return ingredientService.search(name, active);
    }

    @PostMapping
    @Operation(summary = "Create a new ingredient")
    @ResponseStatus(HttpStatus.CREATED)
    public IngredientDto createIngredient(@Valid @RequestBody UpsertIngredientRequest request) {
        return ingredientService.create(request);
    }

    @PatchMapping("/{ingredientId}")
    @Operation(summary = "Update an existing ingredient")
    public IngredientDto updateIngredient(@PathVariable Integer ingredientId,
                                          @Valid @RequestBody UpsertIngredientRequest request) {
        return ingredientService.update(ingredientId, request);
    }

    @DeleteMapping("/{ingredientId}")
    @Operation(summary = "Delete an ingredient by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIngredient(@PathVariable Integer ingredientId) {
        ingredientService.delete(ingredientId);
    }
}


