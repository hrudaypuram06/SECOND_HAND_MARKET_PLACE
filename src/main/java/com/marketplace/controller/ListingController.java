package com.marketplace.controller;

import com.marketplace.model.Listing;
import com.marketplace.service.ListingService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = "*")
public class ListingController {

    @Autowired
    private ListingService listingService;

    /**
     * POST /api/listings
     * Create a new listing
     */
    @PostMapping
    public ResponseEntity<?> createListing(@Valid @RequestBody Listing listing) {
        try {
            Listing created = listingService.createListing(listing);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create listing: " + e.getMessage()));
        }
    }

    /**
     * GET /api/listings
     * Get all listings, with optional filters:
     * ?category=Electronics&condition=Good&minPrice=100&maxPrice=500
     */
    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search
    ) {
        List<Listing> listings;

        if (search != null && !search.isEmpty()) {
            listings = listingService.searchListings(search);
        } else if (category != null || condition != null || minPrice != null || maxPrice != null) {
            listings = listingService.filterListings(category, condition, minPrice, maxPrice);
        } else {
            listings = listingService.getAllListings();
        }

        return ResponseEntity.ok(listings);
    }

    /**
     * GET /api/listings/{id}
     * Get a single listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable Long id) {
        Optional<Listing> listing = listingService.getListingById(id);
        if (listing.isPresent()) {
            return ResponseEntity.ok(listing.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Listing not found with id: " + id));
    }

    /**
     * PUT /api/listings/{id}/sold
     * Mark a listing as sold
     */
    @PutMapping("/{id}/sold")
    public ResponseEntity<?> markAsSold(@PathVariable Long id) {
        Optional<Listing> updated = listingService.markAsSold(id);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Listing not found with id: " + id));
    }

    /**
     * DELETE /api/listings/{id}
     * Delete a listing
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        boolean deleted = listingService.deleteListing(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Listing deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Listing not found with id: " + id));
    }
}
