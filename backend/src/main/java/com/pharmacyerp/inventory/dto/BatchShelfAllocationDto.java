package com.pharmacyerp.inventory.dto;

public record BatchShelfAllocationDto(
        Integer id,
        Integer batchId,
        String batchNumber,
        Integer shelfId,
        Integer locationId,
        String locationName,
        Integer quantity,
        Integer threshold
) {
}
