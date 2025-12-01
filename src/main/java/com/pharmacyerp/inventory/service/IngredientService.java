package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.IngredientDto;
import com.pharmacyerp.inventory.dto.UpsertIngredientRequest;
import com.pharmacyerp.inventory.entity.Ingredient;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.IngredientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @Transactional(readOnly = true)
    public List<IngredientDto> search(String name, Boolean active) {
        List<Ingredient> ingredients;
        if ((name == null || name.isBlank()) && active == null) {
            ingredients = ingredientRepository.findAll();
        } else if (active == null) {
            ingredients = ingredientRepository.findByNameContainingIgnoreCase(name);
        } else {
            ingredients = ingredientRepository.findByNameContainingIgnoreCaseAndActive(
                    name == null ? "" : name, active);
        }
        return ingredients.stream()
                .map(this::toDto)
                .toList();
    }

    public IngredientDto create(UpsertIngredientRequest request) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.name());
        ingredient.setDescription(request.description());
        ingredient.setActive(request.active() != null ? request.active() : Boolean.TRUE);
        return toDto(ingredientRepository.save(ingredient));
    }

    public IngredientDto update(Integer id, UpsertIngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ingredient not found: " + id));
        ingredient.setName(request.name());
        ingredient.setDescription(request.description());
        if (request.active() != null) {
            ingredient.setActive(request.active());
        }
        return toDto(ingredient);
    }

    public void delete(Integer id) {
        if (!ingredientRepository.existsById(id)) {
            throw new NotFoundException("Ingredient not found: " + id);
        }
        ingredientRepository.deleteById(id);
    }

    private IngredientDto toDto(Ingredient ingredient) {
        return new IngredientDto(
                ingredient.getId(),
                ingredient.getName(),
                ingredient.getDescription(),
                ingredient.getActive()
        );
    }
}


