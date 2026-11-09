package com.marketplace.repository;

import com.marketplace.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    // Find by category
    List<Listing> findByCategory(String category);

    // Find by condition
    List<Listing> findByCondition(String condition);

    // Find by sold status
    List<Listing> findBySold(boolean sold);

    // Search by title or description (case-insensitive)
    @Query("SELECT l FROM Listing l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Listing> searchByKeyword(@Param("keyword") String keyword);

    // Filter by category, condition and price range
    @Query("SELECT l FROM Listing l WHERE " +
           "(:category IS NULL OR l.category = :category) AND " +
           "(:condition IS NULL OR l.condition = :condition) AND " +
           "(:minPrice IS NULL OR l.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR l.price <= :maxPrice) " +
           "ORDER BY l.createdAt DESC")
    List<Listing> findWithFilters(
            @Param("category") String category,
            @Param("condition") String condition,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
}
