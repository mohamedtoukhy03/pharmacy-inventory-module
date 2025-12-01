package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.entity.Location;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpsertLocationRequest(
        @NotBlank String locationName,
        @NotNull Location.LocationType locationType,
        Integer parentLocationId,
        Boolean isDirectToMain,
        String address,
        Location.LocationStatus status
) {
}
