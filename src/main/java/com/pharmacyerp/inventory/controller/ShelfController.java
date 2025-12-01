package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.ShelfDto;
import com.pharmacyerp.inventory.dto.UpsertShelfRequest;
import com.pharmacyerp.inventory.service.ShelfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Shelves", description = "Endpoints for managing shelves within locations")
public class ShelfController {

    private final ShelfService shelfService;

    public ShelfController(ShelfService shelfService) {
        this.shelfService = shelfService;
    }

    @GetMapping("/locations/{locationId}/shelves")
    @Operation(summary = "Get all shelves for a location")
    public List<ShelfDto> getShelvesByLocation(@PathVariable Integer locationId) {
        return shelfService.getShelvesByLocation(locationId);
    }

    @PostMapping("/locations/{locationId}/shelves")
    @Operation(summary = "Create a new shelf in a location")
    @ResponseStatus(HttpStatus.CREATED)
    public ShelfDto createShelf(@PathVariable Integer locationId,
                                @Valid @RequestBody UpsertShelfRequest request) {
        return shelfService.create(locationId, request);
    }

    @GetMapping("/shelves/{shelfId}")
    @Operation(summary = "Get shelf details")
    public ShelfDto getShelf(@PathVariable Integer shelfId) {
        return shelfService.getShelf(shelfId);
    }

    @PatchMapping("/shelves/{shelfId}")
    @Operation(summary = "Update an existing shelf")
    public ShelfDto updateShelf(@PathVariable Integer shelfId,
                               @Valid @RequestBody UpsertShelfRequest request) {
        return shelfService.update(shelfId, request);
    }

    @DeleteMapping("/shelves/{shelfId}")
    @Operation(summary = "Delete a shelf")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShelf(@PathVariable Integer shelfId) {
        shelfService.delete(shelfId);
    }
}
