package com.marketplace.repository;

import com.marketplace.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    // Get all inquiries for a specific listing
    List<Inquiry> findByListingIdOrderByCreatedAtDesc(Long listingId);

    // Count inquiries for a listing
    long countByListingId(Long listingId);
}
