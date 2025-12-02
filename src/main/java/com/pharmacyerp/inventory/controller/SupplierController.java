package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.SupplierDto;
import com.pharmacyerp.inventory.dto.UpsertSupplierRequest;
import com.pharmacyerp.inventory.entity.Supplier;
import com.pharmacyerp.inventory.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@Tag(name = "Suppliers", description = "Endpoints for managing suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    @Operation(summary = "Search suppliers with optional filters")
    public List<SupplierDto> searchSuppliers(
            @Parameter(description = "Filter by country") @RequestParam(value = "country", required = false) String country,
            @Parameter(description = "Filter by active status") @RequestParam(value = "activeStatus", required = false) Supplier.ActiveStatus activeStatus) {
        return supplierService.search(country, activeStatus);
    }

    @GetMapping("/{supplierId}")
    @Operation(summary = "Get a supplier by ID")
    public SupplierDto getSupplier(@PathVariable Integer supplierId) {
        return supplierService.getSupplier(supplierId);
    }

    @PostMapping
    @Operation(summary = "Create a new supplier")
    @ResponseStatus(HttpStatus.CREATED)
    public SupplierDto createSupplier(@Valid @RequestBody UpsertSupplierRequest request) {
        return supplierService.create(request);
    }

    @PatchMapping("/{supplierId}")
    @Operation(summary = "Update an existing supplier")
    public SupplierDto updateSupplier(@PathVariable Integer supplierId,
            @Valid @RequestBody UpsertSupplierRequest request) {
        return supplierService.update(supplierId, request);
    }

    @DeleteMapping("/{supplierId}")
    @Operation(summary = "Delete a supplier")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSupplier(@PathVariable Integer supplierId) {
        supplierService.delete(supplierId);
    }
}
