package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.StockLevelDto;
import com.pharmacyerp.inventory.dto.UpsertStockLevelRequest;
import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.entity.Product;
import com.pharmacyerp.inventory.entity.StockLevel;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.LocationRepository;
import com.pharmacyerp.inventory.repository.ProductRepository;
import com.pharmacyerp.inventory.repository.StockLevelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockLevelService {

    private final StockLevelRepository stockLevelRepository;
    private final ProductRepository productRepository;
    private final LocationRepository locationRepository;

    public StockLevelService(StockLevelRepository stockLevelRepository,
                            ProductRepository productRepository,
                            LocationRepository locationRepository) {
        this.stockLevelRepository = stockLevelRepository;
        this.productRepository = productRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<StockLevelDto> search(Integer productId, Integer locationId) {
        List<StockLevel> stockLevels;

        if (productId != null && locationId != null) {
            stockLevels = stockLevelRepository.findByProductIdAndLocationId(productId, locationId)
                    .map(List::of)
                    .orElse(List.of());
        } else if (productId != null) {
            stockLevels = stockLevelRepository.findByProductId(productId);
        } else if (locationId != null) {
            stockLevels = stockLevelRepository.findByLocationId(locationId);
        } else {
            stockLevels = stockLevelRepository.findAll();
        }

        return stockLevels.stream()
                .map(this::toDto)
                .toList();
    }

    public StockLevelDto create(UpsertStockLevelRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new NotFoundException("Product not found: " + request.productId()));

        Location location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new NotFoundException("Location not found: " + request.locationId()));

        // Check if stock level already exists for this product-location combination
        StockLevel existing = stockLevelRepository.findByProductIdAndLocationId(request.productId(), request.locationId())
                .orElse(null);

        StockLevel stockLevel;
        if (existing != null) {
            stockLevel = existing;
        } else {
            stockLevel = new StockLevel();
            stockLevel.setProduct(product);
            stockLevel.setLocation(location);
        }

        stockLevel.setStockType(request.stockType());
        stockLevel.setOnHandQuantity(request.onHandQuantity());
        stockLevel.setDispatchMethod(request.dispatchMethod());

        StockLevel saved = stockLevelRepository.save(stockLevel);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public StockLevelDto getStockLevel(Integer id) {
        StockLevel stockLevel = findStockLevel(id);
        return toDto(stockLevel);
    }

    public StockLevelDto update(Integer id, UpsertStockLevelRequest request) {
        StockLevel stockLevel = findStockLevel(id);

        if (request.productId() != null && !request.productId().equals(stockLevel.getProduct().getId())) {
            Product product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + request.productId()));
            stockLevel.setProduct(product);
        }

        if (request.locationId() != null && !request.locationId().equals(stockLevel.getLocation().getId())) {
            Location location = locationRepository.findById(request.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found: " + request.locationId()));
            stockLevel.setLocation(location);
        }

        if (request.stockType() != null) stockLevel.setStockType(request.stockType());
        if (request.onHandQuantity() != null) stockLevel.setOnHandQuantity(request.onHandQuantity());
        if (request.dispatchMethod() != null) stockLevel.setDispatchMethod(request.dispatchMethod());

        return toDto(stockLevel);
    }

    public void delete(Integer id) {
        StockLevel stockLevel = findStockLevel(id);
        stockLevelRepository.delete(stockLevel);
    }

    private StockLevel findStockLevel(Integer id) {
        return stockLevelRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Stock level not found: " + id));
    }

    private StockLevelDto toDto(StockLevel stockLevel) {
        return new StockLevelDto(
                stockLevel.getId(),
                stockLevel.getProduct().getId(),
                stockLevel.getProduct().getName(),
                stockLevel.getLocation().getId(),
                stockLevel.getLocation().getLocationName(),
                stockLevel.getStockType(),
                stockLevel.getOnHandQuantity(),
                stockLevel.getDispatchMethod()
        );
    }
}
