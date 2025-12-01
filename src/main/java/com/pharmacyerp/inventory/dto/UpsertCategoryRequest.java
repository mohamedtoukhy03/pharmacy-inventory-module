package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertCategoryRequest(
        @NotBlank @Size(max = 30) String name,
        String description
) {
}


