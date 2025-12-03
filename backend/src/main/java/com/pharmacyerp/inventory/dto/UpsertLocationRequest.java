package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpsertLocationRequest(
        @NotBlank String locationName,
        @NotNull LocationType locationType,
        Integer parentLocationId,
        Boolean isDirectToMain,
        String address,
        LocationStatus status
) {
}
