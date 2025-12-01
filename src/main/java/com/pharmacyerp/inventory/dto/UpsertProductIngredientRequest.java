package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpsertProductIngredientRequest(
        @NotNull Integer ingredientId,
        @NotNull @Min(0) Integer amount
) {
}


