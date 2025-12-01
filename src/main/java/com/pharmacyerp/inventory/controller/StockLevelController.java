package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.StockLevelDto;
import com.pharmacyerp.inventory.dto.UpsertStockLevelRequest;
import com.pharmacyerp.inventory.service.StockLevelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stock-levels")
@Tag(name = "Stock Levels", description = "Endpoints for managing stock levels by product and location")
public class StockLevelController {

    private final StockLevelService stockLevelService;

    public StockLevelController(StockLevelService stockLevelService) {
        this.stockLevelService = stockLevelService;
    }

    @GetMapping
    @Operation(summary = "Search stock levels with optional filters")
    public List<StockLevelDto> searchStockLevels(
            @Parameter(description = "Filter by product id")
            @RequestParam(value = "productId", required = false) Integer productId,
            @Parameter(description = "Filter by location id")
            @RequestParam(value = "locationId", required = false) Integer locationId) {
        return stockLevelService.search(productId, locationId);
    }

    @PostMapping
    @Operation(summary = "Create or update a stock level")
    @ResponseStatus(HttpStatus.CREATED)
    public StockLevelDto createStockLevel(@Valid @RequestBody UpsertStockLevelRequest request) {
        return stockLevelService.create(request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get stock level details")
    public StockLevelDto getStockLevel(@PathVariable Integer id) {
        return stockLevelService.getStockLevel(id);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an existing stock level")
    public StockLevelDto updateStockLevel(@PathVariable Integer id,
                                         @Valid @RequestBody UpsertStockLevelRequest request) {
        return stockLevelService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a stock level")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStockLevel(@PathVariable Integer id) {
        stockLevelService.delete(id);
    }
}
