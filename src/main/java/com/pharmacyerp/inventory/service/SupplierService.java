package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.SupplierDto;
import com.pharmacyerp.inventory.dto.UpsertSupplierRequest;
import com.pharmacyerp.inventory.entity.Supplier;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.SupplierRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.pharmacyerp.inventory.service.SupplierSpecifications.*;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> search(String country, Supplier.ActiveStatus activeStatus) {
        Specification<Supplier> spec = Specification.where(hasCountry(country))
                .and(hasActiveStatus(activeStatus));

        return supplierRepository.findAll(spec).stream()
                .map(this::toDto)
                .toList();
    }

    public SupplierDto create(UpsertSupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setSupplierName(request.supplierName());
        supplier.setSupplierPhone(request.supplierPhone());
        supplier.setSupplierEmail(request.supplierEmail());
        supplier.setCountry(request.country());
        supplier.setRating(request.rating());
        supplier.setCurrency(request.currency());
        supplier.setActiveStatus(request.activeStatus() != null 
                ? request.activeStatus() 
                : Supplier.ActiveStatus.active);

        Supplier saved = supplierRepository.save(supplier);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplier(Integer supplierId) {
        Supplier supplier = findSupplier(supplierId);
        return toDto(supplier);
    }

    public SupplierDto update(Integer supplierId, UpsertSupplierRequest request) {
        Supplier supplier = findSupplier(supplierId);

        if (request.supplierName() != null) supplier.setSupplierName(request.supplierName());
        if (request.supplierPhone() != null) supplier.setSupplierPhone(request.supplierPhone());
        if (request.supplierEmail() != null) supplier.setSupplierEmail(request.supplierEmail());
        if (request.country() != null) supplier.setCountry(request.country());
        if (request.rating() != null) supplier.setRating(request.rating());
        if (request.currency() != null) supplier.setCurrency(request.currency());
        if (request.activeStatus() != null) supplier.setActiveStatus(request.activeStatus());

        return toDto(supplier);
    }

    public void delete(Integer supplierId) {
        Supplier supplier = findSupplier(supplierId);
        supplierRepository.delete(supplier);
    }

    private Supplier findSupplier(Integer supplierId) {
        return supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found: " + supplierId));
    }

    private SupplierDto toDto(Supplier supplier) {
        return new SupplierDto(
                supplier.getId(),
                supplier.getSupplierName(),
                supplier.getSupplierPhone(),
                supplier.getSupplierEmail(),
                supplier.getCountry(),
                supplier.getRating(),
                supplier.getCurrency(),
                supplier.getActiveStatus()
        );
    }
}
