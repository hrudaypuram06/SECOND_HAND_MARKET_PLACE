package com.marketplace.service;

import com.marketplace.model.Inquiry;
import com.marketplace.model.Listing;
import com.marketplace.repository.InquiryRepository;
import com.marketplace.repository.ListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private ListingRepository listingRepository;

    /**
     * Submit a buyer inquiry for an available (not sold) listing.
     * Returns empty Optional if listing is not found or is already sold.
     */
    public Optional<Inquiry> submitInquiry(Inquiry inquiry) {
        Optional<Listing> listingOpt = listingRepository.findById(inquiry.getListingId());

        if (listingOpt.isEmpty()) {
            return Optional.empty(); // Listing not found
        }

        Listing listing = listingOpt.get();
        if (listing.isSold()) {
            return Optional.empty(); // Cannot inquire on sold item
        }

        return Optional.of(inquiryRepository.save(inquiry));
    }

    /**
     * Get all inquiries for a specific listing
     */
    public List<Inquiry> getInquiriesForListing(Long listingId) {
        return inquiryRepository.findByListingIdOrderByCreatedAtDesc(listingId);
    }

    /**
     * Get inquiry count for a listing
     */
    public long getInquiryCount(Long listingId) {
        return inquiryRepository.countByListingId(listingId);
    }
}
