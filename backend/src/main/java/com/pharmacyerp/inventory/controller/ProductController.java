package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.*;
import com.pharmacyerp.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Endpoints for managing products and their relationships")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Search and list products with filters and pagination")
    public Page<ProductDto> searchProducts(
            @Parameter(description = "Free-text filter on name, barcode or SKU")
            @RequestParam(value = "filter", required = false) String filter,
            @Parameter(description = "Filter by category id")
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @Parameter(description = "Filter by whether product is a drug")
            @RequestParam(value = "isDrug", required = false) Boolean isDrug,
            @Parameter(description = "Filter by controlled substance flag")
            @RequestParam(value = "controlledSubstance", required = false) Boolean controlledSubstance,
            @Parameter(description = "Page index (0-based)")
            @RequestParam(value = "page", defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "20") int size,
            @Parameter(description = "Sort as 'field,asc' or 'field,desc'")
            @RequestParam(value = "sort", defaultValue = "name,asc") String sort) {

        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction direction = sortParts.length > 1 && "desc".equalsIgnoreCase(sortParts[1])
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        return productService.searchProducts(filter, categoryId, isDrug, controlledSubstance, pageable);
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto createProduct(@Valid @RequestBody CreateProductRequest request) {
        return productService.createProduct(request);
    }

    @GetMapping("/{productId}")
    public ProductDto getProduct(@PathVariable Integer productId) {
        return productService.getProduct(productId);
    }

    @PatchMapping("/{productId}")
    public ProductDto updateProduct(@PathVariable Integer productId,
                                    @Valid @RequestBody UpdateProductRequest request) {
        return productService.updateProduct(productId, request);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Integer productId) {
        productService.deleteProduct(productId);
    }

    @GetMapping("/{productId}/categories")
    public List<CategorySummaryDto> getProductCategories(@PathVariable Integer productId) {
        return productService.getCategories(productId);
    }

    @PostMapping("/{productId}/categories")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addProductCategory(@PathVariable Integer productId,
                                   @Valid @RequestBody AttachCategoryRequest request) {
        productService.addCategory(productId, request.categoryId());
    }

    @DeleteMapping("/{productId}/categories/{catId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeProductCategory(@PathVariable Integer productId,
                                      @PathVariable Integer catId) {
        productService.removeCategory(productId, catId);
    }

    @GetMapping("/{productId}/ingredients")
    public List<ProductIngredientDto> getProductIngredients(@PathVariable Integer productId) {
        return productService.getIngredients(productId);
    }

    @PostMapping("/{productId}/ingredients")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addOrUpdateProductIngredient(@PathVariable Integer productId,
                                             @Valid @RequestBody UpsertProductIngredientRequest request) {
        productService.addOrUpdateIngredient(productId, request.ingredientId(), request.amount());
    }

    @PatchMapping("/{productId}/ingredients/{ingredientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProductIngredient(@PathVariable Integer productId,
                                        @PathVariable Integer ingredientId,
                                        @Valid @RequestBody UpsertProductIngredientRequest request) {
        productService.addOrUpdateIngredient(productId, ingredientId, request.amount());
    }

    @DeleteMapping("/{productId}/ingredients/{ingredientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductIngredient(@PathVariable Integer productId,
                                        @PathVariable Integer ingredientId) {
        productService.removeIngredient(productId, ingredientId);
    }
}


