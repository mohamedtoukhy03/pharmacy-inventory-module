package com.pharmacyerp.inventory.dto;

import java.util.List;

public record ProductDto(
        Integer id,
        String name,
        String barcode,
        String sku,
        String scientificName,
        String description,
        Integer cost,
        Integer sellingPrice,
        Boolean isDrug,
        Boolean controlledSubstance,
        Integer measurementUnitId,
        String measurementUnitName,
        List<CategorySummaryDto> categories,
        List<ProductIngredientDto> ingredients
) {
}


