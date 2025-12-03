package com.pharmacyerp.inventory.dto;

public record StockLevelDto(
        Integer id,
        Integer productId,
        String productName,
        Integer locationId,
        String locationName,
        String stockType,
        Integer onHandQuantity,
        String dispatchMethod
) {
}
