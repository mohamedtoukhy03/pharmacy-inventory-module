package com.pharmacyerp.inventory.dto;

public record IngredientDto(
        Integer id,
        String name,
        String description,
        Boolean active
) {
}


