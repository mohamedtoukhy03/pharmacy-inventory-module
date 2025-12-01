package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.MeasurementUnitDto;
import com.pharmacyerp.inventory.dto.UpsertMeasurementUnitRequest;
import com.pharmacyerp.inventory.entity.MeasurementUnit;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.MeasurementUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MeasurementUnitService {

    private final MeasurementUnitRepository measurementUnitRepository;

    public MeasurementUnitService(MeasurementUnitRepository measurementUnitRepository) {
        this.measurementUnitRepository = measurementUnitRepository;
    }

    @Transactional(readOnly = true)
    public List<MeasurementUnitDto> findAll() {
        return measurementUnitRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public MeasurementUnitDto create(UpsertMeasurementUnitRequest request) {
        MeasurementUnit mu = new MeasurementUnit();
        apply(request, mu);
        return toDto(measurementUnitRepository.save(mu));
    }

    public MeasurementUnitDto update(Integer id, UpsertMeasurementUnitRequest request) {
        MeasurementUnit mu = measurementUnitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Measurement unit not found: " + id));
        apply(request, mu);
        return toDto(mu);
    }

    public void delete(Integer id) {
        if (!measurementUnitRepository.existsById(id)) {
            throw new NotFoundException("Measurement unit not found: " + id);
        }
        measurementUnitRepository.deleteById(id);
    }

    private void apply(UpsertMeasurementUnitRequest request, MeasurementUnit mu) {
        mu.setName(request.name());
        mu.setBaseUnit(request.baseUnit());
        mu.setConversionFactor(request.conversionFactor());
        mu.setDescription(request.description());
        mu.setSymbol(request.symbol());
    }

    private MeasurementUnitDto toDto(MeasurementUnit mu) {
        return new MeasurementUnitDto(
                mu.getId(),
                mu.getName(),
                mu.getBaseUnit(),
                mu.getConversionFactor(),
                mu.getDescription(),
                mu.getSymbol()
        );
    }
}


