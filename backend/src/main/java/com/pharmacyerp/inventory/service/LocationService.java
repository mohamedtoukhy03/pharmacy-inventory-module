package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.LocationDto;
import com.pharmacyerp.inventory.dto.UpsertLocationRequest;
import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.LocationRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.pharmacyerp.inventory.service.LocationSpecifications.*;

@Service
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<LocationDto> search(LocationType type, LocationStatus status) {
        Specification<Location> spec = Specification.where(hasType(type))
                .and(hasStatus(status));

        return locationRepository.findAll(spec).stream()
                .map(this::toDto)
                .toList();
    }

    public LocationDto create(UpsertLocationRequest request) {
        Location location = new Location();
        location.setLocationName(request.locationName());
        location.setLocationType(request.locationType());
        location.setIsDirectToMain(request.isDirectToMain());
        location.setAddress(request.address());
        location.setStatus(request.status() != null ? request.status() : LocationStatus.active);

        if (request.parentLocationId() != null) {
            Location parent = locationRepository.findById(request.parentLocationId())
                    .orElseThrow(() -> new NotFoundException("Parent location not found: " + request.parentLocationId()));
            location.setParentLocation(parent);
        }

        Location saved = locationRepository.save(location);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public LocationDto getLocation(Integer locationId) {
        Location location = findLocation(locationId);
        return toDto(location);
    }

    public LocationDto update(Integer locationId, UpsertLocationRequest request) {
        Location location = findLocation(locationId);

        if (request.locationName() != null) location.setLocationName(request.locationName());
        if (request.locationType() != null) location.setLocationType(request.locationType());
        if (request.isDirectToMain() != null) location.setIsDirectToMain(request.isDirectToMain());
        if (request.address() != null) location.setAddress(request.address());
        if (request.status() != null) location.setStatus(request.status());

        if (request.parentLocationId() != null) {
            Location parent = locationRepository.findById(request.parentLocationId())
                    .orElseThrow(() -> new NotFoundException("Parent location not found: " + request.parentLocationId()));
            location.setParentLocation(parent);
        } else if (request.parentLocationId() == null && location.getParentLocation() != null) {
            location.setParentLocation(null);
        }

        return toDto(location);
    }

    public void delete(Integer locationId) {
        Location location = findLocation(locationId);
        locationRepository.delete(location);
    }

    private Location findLocation(Integer locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new NotFoundException("Location not found: " + locationId));
    }

    private LocationDto toDto(Location location) {
        Integer parentLocationId = location.getParentLocation() != null ? location.getParentLocation().getId() : null;
        String parentLocationName = location.getParentLocation() != null ? location.getParentLocation().getLocationName() : null;

        return new LocationDto(
                location.getId(),
                location.getLocationName(),
                location.getLocationType(),
                parentLocationId,
                parentLocationName,
                location.getIsDirectToMain(),
                location.getAddress(),
                location.getStatus()
        );
    }
}
