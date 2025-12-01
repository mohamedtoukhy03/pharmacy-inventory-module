package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(
        @NotBlank @Size(max = 40) String name,
        @Size(max = 130) String barcode,
        @Size(max = 64) String sku,
        @Size(max = 40) String scientificName,
        String description,
        Integer cost,
        Integer sellingPrice,
        Boolean isDrug,
        Boolean controlledSubstance
) {
}


