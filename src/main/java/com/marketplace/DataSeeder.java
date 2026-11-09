package com.marketplace;

import com.marketplace.model.Listing;
import com.marketplace.repository.ListingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(ListingRepository listingRepository) {
        return args -> {
            // Add sample listings to demonstrate the app
            if (listingRepository.count() == 0) {
                listingRepository.save(new Listing(
                    "iPhone 12 Pro - 128GB Pacific Blue",
                    "Used for 1 year. Minor scratches on the back. Battery health 87%. Comes with original charger and box. No crack on screen. Face ID works perfectly.",
                    "Electronics", 15000.0, "Good", "Rahul Sharma", "rahul@college.edu"
                ));

                listingRepository.save(new Listing(
                    "Engineering Physics Textbook (3rd Edition)",
                    "H.K. Dass - Engineering Physics. Barely used, only first 3 chapters highlighted. Very good condition. Perfect for first-year students.",
                    "Books", 350.0, "Like New", "Priya Patel", "priya@college.edu"
                ));

                Listing sold = new Listing(
                    "Dell Inspiron 15 Laptop (8GB RAM, 512GB SSD)",
                    "2 years old. Works perfectly. Windows 11 installed. Great for coding and design work. Selling because I upgraded.",
                    "Electronics", 28000.0, "Good", "Amit Kumar", "amit@college.edu"
                );
                sold.setSold(true);
                listingRepository.save(sold);

                listingRepository.save(new Listing(
                    "Study Desk + Chair Set",
                    "Wooden study desk (4ft x 2ft) with adjustable chair. Great for hostel room. Light scratches on desk surface. Very sturdy.",
                    "Furniture", 2500.0, "Fair", "Sneha Reddy", "sneha@college.edu"
                ));

                listingRepository.save(new Listing(
                    "JBL Earphones (Original)",
                    "JBL T110 wired earphones. Brand new, never used. Got as a gift but already have wireless ones.",
                    "Electronics", 600.0, "New", "Vikram Singh", "vikram@college.edu"
                ));

                listingRepository.save(new Listing(
                    "Cricket Bat (SG Cobra)",
                    "SG Cobra Gold cricket bat. Used for 2 seasons. Good grip still intact. Slight dents but plays well.",
                    "Sports", 1200.0, "Fair", "Arjun Nair", "arjun@college.edu"
                ));

                System.out.println("\n✅ Sample data loaded! 6 listings created.");
                System.out.println("🌐 Application running at: http://localhost:8080");
            }
        };
    }
}
