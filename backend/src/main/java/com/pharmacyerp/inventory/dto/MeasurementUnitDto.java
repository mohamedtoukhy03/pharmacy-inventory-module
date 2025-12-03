package com.pharmacyerp.inventory.dto;

public record MeasurementUnitDto(
        Integer id,
        String name,
        Boolean baseUnit,
        Integer conversionFactor,
        String description,
        String symbol
) {
}


