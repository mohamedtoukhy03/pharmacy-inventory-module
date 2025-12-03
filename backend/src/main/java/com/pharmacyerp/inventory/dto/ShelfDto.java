package com.pharmacyerp.inventory.dto;

public record ShelfDto(
        Integer id,
        Integer locationId,
        String locationName,
        Integer onHandQty,
        String dispatchMethod
) {
}
