package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.MeasurementUnitDto;
import com.pharmacyerp.inventory.dto.UpsertMeasurementUnitRequest;
import com.pharmacyerp.inventory.service.MeasurementUnitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/measurement-units")
public class MeasurementUnitController {

    private final MeasurementUnitService measurementUnitService;

    public MeasurementUnitController(MeasurementUnitService measurementUnitService) {
        this.measurementUnitService = measurementUnitService;
    }

    @GetMapping
    public List<MeasurementUnitDto> getMeasurementUnits() {
        return measurementUnitService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MeasurementUnitDto createMeasurementUnit(
            @Valid @RequestBody UpsertMeasurementUnitRequest request) {
        return measurementUnitService.create(request);
    }

    @PatchMapping("/{muId}")
    public MeasurementUnitDto updateMeasurementUnit(
            @PathVariable Integer muId,
            @Valid @RequestBody UpsertMeasurementUnitRequest request) {
        return measurementUnitService.update(muId, request);
    }

    @DeleteMapping("/{muId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMeasurementUnit(@PathVariable Integer muId) {
        measurementUnitService.delete(muId);
    }
}


