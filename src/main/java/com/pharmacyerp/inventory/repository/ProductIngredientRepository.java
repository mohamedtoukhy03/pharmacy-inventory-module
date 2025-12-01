package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, Integer> {

    List<ProductIngredient> findByProduct_Id(Integer productId);

    void deleteByProduct_IdAndIngredient_Id(Integer productId, Integer ingredientId);
}


