package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.BatchDto;
import com.pharmacyerp.inventory.dto.UpsertBatchRequest;
import com.pharmacyerp.inventory.entity.Batch;
import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.entity.Product;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.BatchRepository;
import com.pharmacyerp.inventory.repository.LocationRepository;
import com.pharmacyerp.inventory.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static com.pharmacyerp.inventory.service.BatchSpecifications.*;

@Service
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;

    public BatchService(BatchRepository batchRepository,
                       ProductRepository productRepository,
                       LocationRepository locationRepository) {
        this.batchRepository = batchRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public Page<BatchDto> searchBatches(Integer productId,
                                        Integer locationId,
                                        Batch.StockType stockType,
                                        LocalDate expiryBefore,
                                        String batchNumber,
                                        Pageable pageable) {
        Specification<Batch> spec = Specification.where(hasProductId(productId))
                .and(hasLocationId(locationId))
                .and(hasStockType(stockType))
                .and(expiryBefore(expiryBefore))
                .and(batchNumberContains(batchNumber));

        return batchRepository.findAll(spec, pageable)
                .map(this::toDto);
    }

    public BatchDto create(UpsertBatchRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found: " + request.productId()));

        Location location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new NotFoundException("Location not found: " + request.locationId()));

        Batch batch = new Batch();
        batch.setProduct(product);
        batch.setLocation(location);
        batch.setStockType(request.stockType() != null ? request.stockType() : Batch.StockType.available);
        batch.setQuantity(request.quantity());
        batch.setBatchNumber(request.batchNumber());
        batch.setCost(request.cost());
        batch.setSupplierId(request.supplierId());
        batch.setManufacturingDate(request.manufacturingDate());
        batch.setExpiryDate(request.expiryDate());
        batch.setReceivingDate(request.receivingDate());
        batch.setAlertDate(request.alertDate());
        batch.setClearanceDate(request.clearanceDate());

        if (request.parentBatchId() != null) {
            Batch parent = batchRepository.findById(request.parentBatchId())
                    .orElseThrow(() -> new NotFoundException("Parent batch not found: " + request.parentBatchId()));
            batch.setParentBatch(parent);
        }

        Batch saved = batchRepository.save(batch);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public BatchDto getBatch(Integer batchId) {
        Batch batch = findBatch(batchId);
        return toDto(batch);
    }

    public BatchDto update(Integer batchId, UpsertBatchRequest request) {
        Batch batch = findBatch(batchId);

        if (request.productId() != null && !request.productId().equals(batch.getProduct().getId())) {
            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + request.productId()));
            batch.setProduct(product);
        }

        if (request.locationId() != null && !request.locationId().equals(batch.getLocation().getId())) {
            Location location = locationRepository.findById(request.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found: " + request.locationId()));
            batch.setLocation(location);
        }

        if (request.stockType() != null) batch.setStockType(request.stockType());
        if (request.quantity() != null) batch.setQuantity(request.quantity());
        if (request.batchNumber() != null) batch.setBatchNumber(request.batchNumber());
        if (request.cost() != null) batch.setCost(request.cost());
        if (request.supplierId() != null) batch.setSupplierId(request.supplierId());
        if (request.manufacturingDate() != null) batch.setManufacturingDate(request.manufacturingDate());
        if (request.expiryDate() != null) batch.setExpiryDate(request.expiryDate());
        if (request.receivingDate() != null) batch.setReceivingDate(request.receivingDate());
        if (request.alertDate() != null) batch.setAlertDate(request.alertDate());
        if (request.clearanceDate() != null) batch.setClearanceDate(request.clearanceDate());

        if (request.parentBatchId() != null) {
            Batch parent = batchRepository.findById(request.parentBatchId())
                    .orElseThrow(() -> new NotFoundException("Parent batch not found: " + request.parentBatchId()));
            batch.setParentBatch(parent);
        } else if (request.parentBatchId() == null && batch.getParentBatch() != null) {
            batch.setParentBatch(null);
        }

        return toDto(batch);
    }

    public void delete(Integer batchId) {
        Batch batch = findBatch(batchId);
        batchRepository.delete(batch);
    }

    private Batch findBatch(Integer batchId) {
        return batchRepository.findById(batchId)
                .orElseThrow(() -> new NotFoundException("Batch not found: " + batchId));
    }

    private BatchDto toDto(Batch batch) {
        Integer parentBatchId = batch.getParentBatch() != null ? batch.getParentBatch().getId() : null;

        return new BatchDto(
                batch.getId(),
                batch.getProduct().getId(),
                batch.getProduct().getName(),
                batch.getLocation().getId(),
                batch.getLocation().getLocationName(),
                batch.getStockType(),
                batch.getQuantity(),
                batch.getBatchNumber(),
                batch.getCost(),
                batch.getSupplierId(),
                batch.getManufacturingDate(),
                batch.getExpiryDate(),
                batch.getReceivingDate(),
                batch.getAlertDate(),
                batch.getClearanceDate(),
                parentBatchId
        );
    }
}
