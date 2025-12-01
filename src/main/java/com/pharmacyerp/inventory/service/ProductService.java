package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.*;
import com.pharmacyerp.inventory.entity.Category;
import com.pharmacyerp.inventory.entity.Ingredient;
import com.pharmacyerp.inventory.entity.Product;
import com.pharmacyerp.inventory.entity.ProductIngredient;
import com.pharmacyerp.inventory.entity.MeasurementUnit;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.CategoryRepository;
import com.pharmacyerp.inventory.repository.IngredientRepository;
import com.pharmacyerp.inventory.repository.ProductIngredientRepository;
import com.pharmacyerp.inventory.repository.ProductRepository;
import com.pharmacyerp.inventory.repository.MeasurementUnitRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.pharmacyerp.inventory.service.ProductSpecifications.*;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final ProductIngredientRepository productIngredientRepository;
    private final MeasurementUnitRepository measurementUnitRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          IngredientRepository ingredientRepository,
                          ProductIngredientRepository productIngredientRepository,
                          MeasurementUnitRepository measurementUnitRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.ingredientRepository = ingredientRepository;
        this.productIngredientRepository = productIngredientRepository;
        this.measurementUnitRepository = measurementUnitRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String filter,
                                           Integer categoryId,
                                           Boolean isDrug,
                                           Boolean controlledSubstance,
                                           Pageable pageable) {

        Specification<Product> spec = Specification.where(nameOrBarcodeOrSkuContains(filter))
                .and(inCategory(categoryId))
                .and(hasIsDrug(isDrug))
                .and(hasControlledSubstance(controlledSubstance));

        return productRepository.findAll(spec, pageable)
                .map(this::toDto);
    }

    public ProductDto createProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setBarcode(request.barcode());
        product.setSku(request.sku());
        product.setScientificName(request.scientificName());
        product.setDescription(request.description());
        product.setCost(request.cost());
        product.setSellingPrice(request.sellingPrice());
        product.setIsDrug(request.isDrug());
        product.setControlledSubstance(request.controlledSubstance());

        if (request.measurementUnitId() != null) {
            MeasurementUnit mu = measurementUnitRepository.findById(request.measurementUnitId())
                    .orElseThrow(() -> new NotFoundException("Measurement unit not found: " + request.measurementUnitId()));
            product.setMeasurementUnit(mu);
        }

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public ProductDto getProduct(Integer productId) {
        Product product = findProduct(productId);
        return toDto(product);
    }

    public ProductDto updateProduct(Integer productId, UpdateProductRequest request) {
        Product product = findProduct(productId);

        if (request.name() != null) product.setName(request.name());
        if (request.barcode() != null) product.setBarcode(request.barcode());
        if (request.sku() != null) product.setSku(request.sku());
        if (request.scientificName() != null) product.setScientificName(request.scientificName());
        if (request.description() != null) product.setDescription(request.description());
        if (request.cost() != null) product.setCost(request.cost());
        if (request.sellingPrice() != null) product.setSellingPrice(request.sellingPrice());
        if (request.isDrug() != null) product.setIsDrug(request.isDrug());
        if (request.controlledSubstance() != null) product.setControlledSubstance(request.controlledSubstance());
        if (request.measurementUnitId() != null) {
            MeasurementUnit mu = measurementUnitRepository.findById(request.measurementUnitId())
                    .orElseThrow(() -> new NotFoundException("Measurement unit not found: " + request.measurementUnitId()));
            product.setMeasurementUnit(mu);
        }

        return toDto(product);
    }

    public void deleteProduct(Integer productId) {
        Product product = findProduct(productId);
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<CategorySummaryDto> getCategories(Integer productId) {
        Product product = findProduct(productId);
        return product.getCategories().stream()
                .map(c -> new CategorySummaryDto(c.getId(), c.getName()))
                .toList();
    }

    public void addCategory(Integer productId, Integer categoryId) {
        Product product = findProduct(productId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found: " + categoryId));
        product.getCategories().add(category);
    }

    public void removeCategory(Integer productId, Integer categoryId) {
        Product product = findProduct(productId);
        boolean removed = product.getCategories().removeIf(c -> c.getId().equals(categoryId));
        if (!removed) {
            throw new NotFoundException("Category not linked to product");
        }
    }

    @Transactional(readOnly = true)
    public List<ProductIngredientDto> getIngredients(Integer productId) {
        Product product = findProduct(productId);
        return productIngredientRepository.findByProduct_Id(product.getId()).stream()
                .map(pi -> new ProductIngredientDto(
                        pi.getIngredient().getId(),
                        pi.getIngredient().getName(),
                        pi.getAmount()
                ))
                .toList();
    }

    public void addOrUpdateIngredient(Integer productId, Integer ingredientId, Integer amount) {
        Product product = findProduct(productId);
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new NotFoundException("Ingredient not found: " + ingredientId));

        ProductIngredient link = product.getIngredients().stream()
                .filter(pi -> pi.getIngredient().getId().equals(ingredientId))
                .findFirst()
                .orElseGet(() -> {
                    ProductIngredient pi = new ProductIngredient();
                    pi.setProduct(product);
                    pi.setIngredient(ingredient);
                    product.getIngredients().add(pi);
                    return pi;
                });

        link.setAmount(amount);
    }

    public void removeIngredient(Integer productId, Integer ingredientId) {
        Product product = findProduct(productId);

        boolean removedFromCollection = product.getIngredients().removeIf(
                pi -> pi.getIngredient().getId().equals(ingredientId)
        );

        productIngredientRepository.deleteByProduct_IdAndIngredient_Id(productId, ingredientId);

        if (!removedFromCollection) {
            throw new NotFoundException("Ingredient not linked to product");
        }
    }

    private Product findProduct(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
    }

    private ProductDto toDto(Product product) {
        List<CategorySummaryDto> categories = product.getCategories().stream()
                .map(c -> new CategorySummaryDto(c.getId(), c.getName()))
                .toList();

        List<ProductIngredientDto> ingredients = product.getIngredients().stream()
                .map(pi -> new ProductIngredientDto(
                        pi.getIngredient().getId(),
                        pi.getIngredient().getName(),
                        pi.getAmount()
                ))
                .toList();

        Integer muId = product.getMeasurementUnit() != null ? product.getMeasurementUnit().getId() : null;
        String muName = product.getMeasurementUnit() != null ? product.getMeasurementUnit().getName() : null;

        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getBarcode(),
                product.getSku(),
                product.getScientificName(),
                product.getDescription(),
                product.getCost(),
                product.getSellingPrice(),
                product.getIsDrug(),
                product.getControlledSubstance(),
                muId,
                muName,
                categories,
                ingredients
        );
    }
}


