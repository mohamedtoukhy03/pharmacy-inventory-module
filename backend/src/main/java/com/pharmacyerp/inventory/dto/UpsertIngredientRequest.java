package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertIngredientRequest(
        @NotBlank @Size(max = 30) String name,
        String description,
        Boolean active
) {
}


