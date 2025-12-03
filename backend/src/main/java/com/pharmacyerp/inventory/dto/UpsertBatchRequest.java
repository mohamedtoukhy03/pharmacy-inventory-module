package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.StockType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpsertBatchRequest(
        @NotNull(message = "Product ID is required")
        Integer productId,
        
        @NotNull(message = "Location ID is required")
        Integer locationId,
        
        StockType stockType,
        
        @NotNull(message = "Quantity is required")
        Integer quantity,
        
        String batchNumber, // Optional
        
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
