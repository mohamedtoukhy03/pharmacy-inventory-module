package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.dto.ShelfDto;
import com.pharmacyerp.inventory.dto.UpsertShelfRequest;
import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.entity.Shelf;
import com.pharmacyerp.inventory.exception.NotFoundException;
import com.pharmacyerp.inventory.repository.LocationRepository;
import com.pharmacyerp.inventory.repository.ShelfRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ShelfService {

    private final ShelfRepository shelfRepository;
    private final LocationRepository locationRepository;

    public ShelfService(ShelfRepository shelfRepository, LocationRepository locationRepository) {
        this.shelfRepository = shelfRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<ShelfDto> getShelvesByLocation(Integer locationId) {
        return shelfRepository.findByLocationId(locationId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ShelfDto getShelf(Integer shelfId) {
        Shelf shelf = findShelf(shelfId);
        return toDto(shelf);
    }

    public ShelfDto create(Integer locationId, UpsertShelfRequest request) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new NotFoundException("Location not found: " + locationId));

        Shelf shelf = new Shelf();
        shelf.setLocation(location);
        shelf.setOnHandQty(request.onHandQty());
        shelf.setDispatchMethod(request.dispatchMethod());

        Shelf saved = shelfRepository.save(shelf);
        return toDto(saved);
    }

    public ShelfDto update(Integer shelfId, UpsertShelfRequest request) {
        Shelf shelf = findShelf(shelfId);

        if (request.locationId() != null && !request.locationId().equals(shelf.getLocation().getId())) {
            Location location = locationRepository.findById(request.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found: " + request.locationId()));
            shelf.setLocation(location);
        }

        if (request.onHandQty() != null) shelf.setOnHandQty(request.onHandQty());
        if (request.dispatchMethod() != null) shelf.setDispatchMethod(request.dispatchMethod());

        return toDto(shelf);
    }

    public void delete(Integer shelfId) {
        Shelf shelf = findShelf(shelfId);
        shelfRepository.delete(shelf);
    }

    private Shelf findShelf(Integer shelfId) {
        return shelfRepository.findById(shelfId)
                .orElseThrow(() -> new NotFoundException("Shelf not found: " + shelfId));
    }

    private ShelfDto toDto(Shelf shelf) {
        return new ShelfDto(
                shelf.getId(),
                shelf.getLocation().getId(),
                shelf.getLocation().getLocationName(),
                shelf.getOnHandQty(),
                shelf.getDispatchMethod()
        );
    }
}
