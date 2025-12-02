package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Supplier;
import com.pharmacyerp.inventory.enums.ActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer>, JpaSpecificationExecutor<Supplier> {

    List<Supplier> findByCountry(String country);

    List<Supplier> findByActiveStatus(ActiveStatus activeStatus);

    List<Supplier> findByCountryAndActiveStatus(String country, ActiveStatus activeStatus);
}
