package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.MeasurementUnitDto;
import com.pharmacyerp.inventory.dto.UpsertMeasurementUnitRequest;
import com.pharmacyerp.inventory.service.MeasurementUnitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/measurement-units")
@Tag(name = "Measurement Units", description = "Endpoints for managing measurement units")
public class MeasurementUnitController {

    private final MeasurementUnitService measurementUnitService;

    public MeasurementUnitController(MeasurementUnitService measurementUnitService) {
        this.measurementUnitService = measurementUnitService;
    }

    @GetMapping
    @Operation(summary = "List all measurement units")
    public List<MeasurementUnitDto> getMeasurementUnits() {
        return measurementUnitService.findAll();
    }

    @PostMapping
    @Operation(summary = "Create a new measurement unit")
    @ResponseStatus(HttpStatus.CREATED)
    public MeasurementUnitDto createMeasurementUnit(
            @Valid @RequestBody UpsertMeasurementUnitRequest request) {
        return measurementUnitService.create(request);
    }

    @PatchMapping("/{muId}")
    @Operation(summary = "Update an existing measurement unit")
    public MeasurementUnitDto updateMeasurementUnit(
            @PathVariable Integer muId,
            @Valid @RequestBody UpsertMeasurementUnitRequest request) {
        return measurementUnitService.update(muId, request);
    }

    @DeleteMapping("/{muId}")
    @Operation(summary = "Delete a measurement unit by id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMeasurementUnit(@PathVariable Integer muId) {
        measurementUnitService.delete(muId);
    }
}


