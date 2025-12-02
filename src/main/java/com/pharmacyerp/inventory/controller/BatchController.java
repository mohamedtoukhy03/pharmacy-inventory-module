package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.BatchDto;
import com.pharmacyerp.inventory.dto.UpsertBatchRequest;
import com.pharmacyerp.inventory.enums.StockType;
import com.pharmacyerp.inventory.service.BatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/batches")
@Tag(name = "Batches", description = "Endpoints for managing product batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @GetMapping
    @Operation(summary = "Search and list batches with filters and pagination")
    public Page<BatchDto> searchBatches(
            @Parameter(description = "Filter by product id")
            @RequestParam(value = "productId", required = false) Integer productId,
            @Parameter(description = "Filter by location id")
            @RequestParam(value = "locationId", required = false) Integer locationId,
            @Parameter(description = "Filter by stock type")
            @RequestParam(value = "stockType", required = false) StockType stockType,
            @Parameter(description = "Filter batches expiring before this date")
            @RequestParam(value = "expiryBefore", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryBefore,
            @Parameter(description = "Filter by batch number")
            @RequestParam(value = "batchNumber", required = false) String batchNumber,
            @Parameter(description = "Page index (0-based)")
            @RequestParam(value = "page", defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "20") int size,
            @Parameter(description = "Sort as 'field,asc' or 'field,desc'")
            @RequestParam(value = "sort", defaultValue = "id,asc") String sort) {

        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return batchService.searchBatches(productId, locationId, stockType, expiryBefore, batchNumber, pageable);
    }

    @PostMapping
    @Operation(summary = "Create a new batch")
    @ResponseStatus(HttpStatus.CREATED)
    public BatchDto createBatch(@Valid @RequestBody UpsertBatchRequest request) {
        return batchService.create(request);
    }

    @GetMapping("/{batchId}")
    @Operation(summary = "Get batch details")
    public BatchDto getBatch(@PathVariable Integer batchId) {
        return batchService.getBatch(batchId);
    }

    @PatchMapping("/{batchId}")
    @Operation(summary = "Update an existing batch")
    public BatchDto updateBatch(@PathVariable Integer batchId,
                               @Valid @RequestBody UpsertBatchRequest request) {
        return batchService.update(batchId, request);
    }

    @DeleteMapping("/{batchId}")
    @Operation(summary = "Delete a batch")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBatch(@PathVariable Integer batchId) {
        batchService.delete(batchId);
    }
}
