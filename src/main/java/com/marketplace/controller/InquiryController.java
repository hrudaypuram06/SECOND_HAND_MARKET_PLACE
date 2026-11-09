package com.marketplace.controller;

import com.marketplace.model.Inquiry;
import com.marketplace.service.InquiryService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    /**
     * POST /api/inquiries
     * Submit a buyer inquiry for a listing
     * Returns 400 if listing is sold or not found
     */
    @PostMapping
    public ResponseEntity<?> submitInquiry(@Valid @RequestBody Inquiry inquiry) {
        Optional<Inquiry> saved = inquiryService.submitInquiry(inquiry);
        if (saved.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(saved.get());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Cannot submit inquiry. Item may be sold or not found."));
    }

    /**
     * GET /api/inquiries/listing/{listingId}
     * Get all inquiries for a specific listing
     */
    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<Inquiry>> getInquiriesForListing(@PathVariable Long listingId) {
        List<Inquiry> inquiries = inquiryService.getInquiriesForListing(listingId);
        return ResponseEntity.ok(inquiries);
    }

    /**
     * GET /api/inquiries/listing/{listingId}/count
     * Get number of inquiries for a listing
     */
    @GetMapping("/listing/{listingId}/count")
    public ResponseEntity<Map<String, Long>> getInquiryCount(@PathVariable Long listingId) {
        long count = inquiryService.getInquiryCount(listingId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
