package com.pharmacyerp.inventory.controller;

import com.pharmacyerp.inventory.dto.LocationDto;
import com.pharmacyerp.inventory.dto.UpsertLocationRequest;
import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@Tag(name = "Locations", description = "Endpoints for managing locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @Operation(summary = "Search locations with optional filters")
    public List<LocationDto> searchLocations(
            @Parameter(description = "Filter by location type")
            @RequestParam(value = "type", required = false) Location.LocationType type,
            @Parameter(description = "Filter by status")
            @RequestParam(value = "status", required = false) Location.LocationStatus status) {
        return locationService.search(type, status);
    }

    @PostMapping
    @Operation(summary = "Create a new location")
    @ResponseStatus(HttpStatus.CREATED)
    public LocationDto createLocation(@Valid @RequestBody UpsertLocationRequest request) {
        return locationService.create(request);
    }

    @GetMapping("/{locationId}")
    @Operation(summary = "Get location details")
    public LocationDto getLocation(@PathVariable Integer locationId) {
        return locationService.getLocation(locationId);
    }

    @PatchMapping("/{locationId}")
    @Operation(summary = "Update an existing location")
    public LocationDto updateLocation(@PathVariable Integer locationId,
                                     @Valid @RequestBody UpsertLocationRequest request) {
        return locationService.update(locationId, request);
    }

    @DeleteMapping("/{locationId}")
    @Operation(summary = "Delete a location")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLocation(@PathVariable Integer locationId) {
        locationService.delete(locationId);
    }
}
