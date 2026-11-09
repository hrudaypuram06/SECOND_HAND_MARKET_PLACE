package com.marketplace.service;

import com.marketplace.model.Listing;
import com.marketplace.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ListingService {

    @Autowired
    private ListingRepository listingRepository;

    /**
     * Create a new listing
     */
    public Listing createListing(Listing listing) {
        listing.setSold(false);
        return listingRepository.save(listing);
    }

    /**
     * Get all listings ordered by newest first
     */
    public List<Listing> getAllListings() {
        return listingRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                    com.marketplace.model.Listing::getCreatedAt,
                    Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    /**
     * Get a listing by ID
     */
    public Optional<Listing> getListingById(Long id) {
        return listingRepository.findById(id);
    }

    /**
     * Mark a listing as SOLD
     */
    public Optional<Listing> markAsSold(Long id) {
        Optional<Listing> listingOpt = listingRepository.findById(id);
        if (listingOpt.isPresent()) {
            Listing listing = listingOpt.get();
            listing.setSold(true);
            return Optional.of(listingRepository.save(listing));
        }
        return Optional.empty();
    }

    /**
     * Filter listings by category, condition, and price range
     */
    public List<Listing> filterListings(String category, String condition,
                                        Double minPrice, Double maxPrice) {
        return listingRepository.findWithFilters(
                (category != null && !category.isEmpty()) ? category : null,
                (condition != null && !condition.isEmpty()) ? condition : null,
                minPrice,
                maxPrice
        );
    }

    /**
     * Search listings by keyword
     */
    public List<Listing> searchListings(String keyword) {
        return listingRepository.searchByKeyword(keyword);
    }

    /**
     * Delete a listing
     */
    public boolean deleteListing(Long id) {
        if (listingRepository.existsById(id)) {
            listingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
