package com.pharmacyerp.inventory.dto;

public record ProductIngredientDto(
        Integer ingredientId,
        String ingredientName,
        Integer amount
) {
}


