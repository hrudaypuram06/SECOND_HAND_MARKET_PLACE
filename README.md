# 🏷️ SecondSell - Second-Hand Marketplace

A full-stack Java Spring Boot web application where students can list used items for sale and buyers can inquire about them.

## 📋 Problem Statement (Problem #47)

Students want a website to list used items for sale and ask sellers questions about them.

### Functional Requirements:
1. ✅ **Listings** - Sellers create listings with title, description, category, price, and condition
2. ✅ **Browsing** - Display listed items to potential buyers
3. ✅ **Inquiries** - Buyers submit inquiries about available listings
4. ✅ **Sold Status** - Sellers mark listings as sold
5. ✅ **Sold Items** - Sold listings remain visible but reject new inquiries
6. ✅ **Search & Filter** - Filter by category, condition, and price range *(Bonus)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | Spring Boot 2.7.18 |
| ORM | Spring Data JPA + Hibernate |
| Database | H2 (In-Memory) |
| Validation | Spring Validation (javax) |
| Frontend | HTML5 + Vanilla CSS + JavaScript |
| Build Tool | Maven 3.9+ |
| Java Version | Java 11 |

---

## 📁 Project Structure

```
secondhand-marketplace/
├── pom.xml
├── src/main/java/com/marketplace/
│   ├── MarketplaceApplication.java       # App entry point
│   ├── DataSeeder.java                   # Sample data loader
│   ├── model/
│   │   ├── Listing.java                  # Listing entity
│   │   └── Inquiry.java                  # Inquiry entity
│   ├── repository/
│   │   ├── ListingRepository.java        # Listing DB queries
│   │   └── InquiryRepository.java        # Inquiry DB queries
│   ├── service/
│   │   ├── ListingService.java           # Listing business logic
│   │   └── InquiryService.java          # Inquiry business logic
│   └── controller/
│       ├── ListingController.java        # REST API for listings
│       └── InquiryController.java        # REST API for inquiries
└── src/main/resources/
    ├── application.properties            # App configuration
    └── static/
        ├── index.html                    # Frontend SPA
        ├── css/style.css                 # Premium styling
        └── js/app.js                     # Frontend logic
```

---

## 🚀 How to Run

### Prerequisites
- Java 11+ installed
- Maven 3.6+ installed

### Steps

```bash
# 1. Navigate to project directory
cd "D:\SECOND HAND MARKET PLACE"

# 2. Run the application
mvn spring-boot:run

# 3. Open in browser
# http://localhost:8080
```

---

## 🌐 REST API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/listings` | Create a new listing |
| `GET` | `/api/listings` | Get all listings |
| `GET` | `/api/listings?category=Electronics` | Filter by category |
| `GET` | `/api/listings?condition=Good` | Filter by condition |
| `GET` | `/api/listings?minPrice=100&maxPrice=500` | Filter by price |
| `GET` | `/api/listings?search=iPhone` | Search by keyword |
| `GET` | `/api/listings/{id}` | Get a single listing |
| `PUT` | `/api/listings/{id}/sold` | Mark listing as sold |
| `DELETE` | `/api/listings/{id}` | Delete a listing |
| `POST` | `/api/inquiries` | Submit a buyer inquiry |
| `GET` | `/api/inquiries/listing/{id}` | Get inquiries for listing |
| `GET` | `/api/inquiries/listing/{id}/count` | Get inquiry count |

---

## 🗄️ H2 Console

Access the database directly at: http://localhost:8080/h2-console

- **JDBC URL**: `jdbc:h2:mem:marketplacedb`
- **Username**: `sa`
- **Password**: *(leave blank)*

---

## 📌 Key Design Decisions

1. **In-Memory H2 DB**: No setup required - perfect for a hackathon/demo
2. **Sold-Item Inquiry Block**: `InquiryService` checks the listing's sold status before saving
3. **JPQL Filtering**: Custom `@Query` in repository for flexible multi-filter queries
4. **SPA Frontend**: Single-page app with section switching via JS (no page reloads)
5. **Data Seeder**: 6 sample listings created on startup for immediate demo
