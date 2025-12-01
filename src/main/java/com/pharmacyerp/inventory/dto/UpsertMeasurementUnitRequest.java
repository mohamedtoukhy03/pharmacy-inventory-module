package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertMeasurementUnitRequest(
        @NotBlank @Size(max = 30) String name,
        Boolean baseUnit,
        Integer conversionFactor,
        String description,
        String symbol
) {
}


