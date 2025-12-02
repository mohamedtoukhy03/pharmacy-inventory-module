package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.StockType;

import java.time.LocalDate;

public record BatchDto(
        Integer id,
        Integer productId,
        String productName,
        Integer locationId,
        String locationName,
        StockType stockType,
        Integer quantity,
        String batchNumber,
        Integer cost,
        Integer supplierId,
        LocalDate manufacturingDate,
        LocalDate expiryDate,
        LocalDate receivingDate,
        LocalDate alertDate,
        LocalDate clearanceDate,
        Integer parentBatchId
) {
}
