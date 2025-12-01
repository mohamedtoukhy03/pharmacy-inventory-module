package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.BatchShelfAllocationDto;
import com.pharmacyerp.inventory.dto.UpsertBatchShelfAllocationRequest;
import com.pharmacyerp.inventory.service.BatchShelfAllocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/batches/{batchId}/shelves")
@Tag(name = "Batch Shelf Allocations", description = "Endpoints for managing batch-to-shelf allocations")
public class BatchShelfAllocationController {

    private final BatchShelfAllocationService allocationService;

    public BatchShelfAllocationController(BatchShelfAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    @Operation(summary = "Get all shelf allocations for a batch")
    public List<BatchShelfAllocationDto> getAllocations(@PathVariable Integer batchId) {
        return allocationService.getAllocationsByBatch(batchId);
    }

    @PostMapping
    @Operation(summary = "Create a new batch-to-shelf allocation")
    @ResponseStatus(HttpStatus.CREATED)
    public BatchShelfAllocationDto createAllocation(@PathVariable Integer batchId,
                                                     @Valid @RequestBody UpsertBatchShelfAllocationRequest request) {
        return allocationService.create(batchId, request);
    }

    @GetMapping("/{allocationId}")
    @Operation(summary = "Get allocation details")
    public BatchShelfAllocationDto getAllocation(@PathVariable Integer batchId,
                                                 @PathVariable Integer allocationId) {
        return allocationService.getAllocation(allocationId);
    }

    @PatchMapping("/{allocationId}")
    @Operation(summary = "Update an existing allocation")
    public BatchShelfAllocationDto updateAllocation(@PathVariable Integer batchId,
                                                    @PathVariable Integer allocationId,
                                                    @Valid @RequestBody UpsertBatchShelfAllocationRequest request) {
        return allocationService.update(batchId, allocationId, request);
    }

    @DeleteMapping("/{allocationId}")
    @Operation(summary = "Delete an allocation")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllocation(@PathVariable Integer batchId,
                                 @PathVariable Integer allocationId) {
        allocationService.delete(batchId, allocationId);
    }
}
