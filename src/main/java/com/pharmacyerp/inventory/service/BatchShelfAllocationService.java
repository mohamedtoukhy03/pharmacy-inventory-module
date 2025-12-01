package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.BatchShelfAllocationDto;
import com.pharmacyerp.inventory.dto.UpsertBatchShelfAllocationRequest;
import com.pharmacyerp.inventory.entity.Batch;
import com.pharmacyerp.inventory.entity.BatchShelfAllocation;
import com.pharmacyerp.inventory.entity.Shelf;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.BatchRepository;
import com.pharmacyerp.inventory.repository.BatchShelfAllocationRepository;
import com.pharmacyerp.inventory.repository.ShelfRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BatchShelfAllocationService {

    private final BatchShelfAllocationRepository allocationRepository;
    private final BatchRepository batchRepository;
    private final ShelfRepository shelfRepository;

    public BatchShelfAllocationService(BatchShelfAllocationRepository allocationRepository,
                                      BatchRepository batchRepository,
                                      ShelfRepository shelfRepository) {
        this.allocationRepository = allocationRepository;
        this.batchRepository = batchRepository;
        this.shelfRepository = shelfRepository;
    }

    @Transactional(readOnly = true)
    public List<BatchShelfAllocationDto> getAllocationsByBatch(Integer batchId) {
        return allocationRepository.findByBatchId(batchId).stream()
                .map(this::toDto)
                .toList();
    }

    public BatchShelfAllocationDto create(Integer batchId, UpsertBatchShelfAllocationRequest request) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found: " + batchId));

        Shelf shelf = shelfRepository.findById(request.shelfId())
                .orElseThrow(() -> new NotFoundException("Shelf not found: " + request.shelfId()));

        BatchShelfAllocation allocation = new BatchShelfAllocation();
        allocation.setBatch(batch);
        allocation.setShelf(shelf);
        allocation.setQuantity(request.quantity());
        allocation.setThreshold(request.threshold());

        BatchShelfAllocation saved = allocationRepository.save(allocation);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public BatchShelfAllocationDto getAllocation(Integer allocationId) {
        BatchShelfAllocation allocation = findAllocation(allocationId);
        return toDto(allocation);
    }

    public BatchShelfAllocationDto update(Integer batchId, Integer allocationId, UpsertBatchShelfAllocationRequest request) {
        BatchShelfAllocation allocation = findAllocation(allocationId);

        if (!allocation.getBatch().getId().equals(batchId)) {
            throw new NotFoundException("Allocation does not belong to batch: " + batchId);
        }

        if (request.shelfId() != null && !request.shelfId().equals(allocation.getShelf().getId())) {
            Shelf shelf = shelfRepository.findById(request.shelfId())
                    .orElseThrow(() -> new NotFoundException("Shelf not found: " + request.shelfId()));
            allocation.setShelf(shelf);
        }

        if (request.quantity() != null) allocation.setQuantity(request.quantity());
        if (request.threshold() != null) allocation.setThreshold(request.threshold());

        return toDto(allocation);
    }

    public void delete(Integer batchId, Integer allocationId) {
        BatchShelfAllocation allocation = findAllocation(allocationId);

        if (!allocation.getBatch().getId().equals(batchId)) {
            throw new NotFoundException("Allocation does not belong to batch: " + batchId);
        }

        allocationRepository.delete(allocation);
    }

    private BatchShelfAllocation findAllocation(Integer allocationId) {
        return allocationRepository.findById(allocationId)
                .orElseThrow(() -> new NotFoundException("Batch shelf allocation not found: " + allocationId));
    }

    private BatchShelfAllocationDto toDto(BatchShelfAllocation allocation) {
        return new BatchShelfAllocationDto(
                allocation.getId(),
                allocation.getBatch().getId(),
                allocation.getBatch().getBatchNumber(),
                allocation.getShelf().getId(),
                allocation.getShelf().getLocation().getId(),
                allocation.getShelf().getLocation().getLocationName(),
                allocation.getQuantity(),
                allocation.getThreshold()
        );
    }
}
