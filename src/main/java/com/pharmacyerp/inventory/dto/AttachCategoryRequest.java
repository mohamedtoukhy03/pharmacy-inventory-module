package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotNull;

public record AttachCategoryRequest(
        @NotNull Integer categoryId
) {
}


