package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.IngredientDto;
import com.pharmacyerp.inventory.dto.UpsertIngredientRequest;
import com.pharmacyerp.inventory.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public List<IngredientDto> searchIngredients(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "active", required = false) Boolean active) {
        return ingredientService.search(name, active);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IngredientDto createIngredient(@Valid @RequestBody UpsertIngredientRequest request) {
        return ingredientService.create(request);
    }

    @PatchMapping("/{ingredientId}")
    public IngredientDto updateIngredient(@PathVariable Integer ingredientId,
                                          @Valid @RequestBody UpsertIngredientRequest request) {
        return ingredientService.update(ingredientId, request);
    }

    @DeleteMapping("/{ingredientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIngredient(@PathVariable Integer ingredientId) {
        ingredientService.delete(ingredientId);
    }
}


