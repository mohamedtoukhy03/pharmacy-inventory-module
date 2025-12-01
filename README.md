## Pharmacy Inventory Module (Spring Boot)

This module is part of a modular Pharmacy ERP system and provides **inventory-related APIs**:

- Product catalogue (list, detail, search, categories, ingredients)
- Reference data (categories, ingredients, measurement units)

### Tech stack

- Spring Boot 4 (Web MVC, Data JPA, Validation, Security base)
- PostgreSQL (schema defined in `sql`)
- Spring Data JPA for persistence
- springdoc-openapi for Swagger UI and OpenAPI docs

### Project structure

- `com.pharmacyerp.inventory.config` – shared configuration (OpenAPI)
- `com.pharmacyerp.inventory.controller` – REST controllers for public APIs
- `com.pharmacyerp.inventory.dto` – request/response models (decoupled from entities)
- `com.pharmacyerp.inventory.entity` – JPA entities mapped to the SQL schema
- `com.pharmacyerp.inventory.repository` – Spring Data repositories
- `com.pharmacyerp.inventory.service` – business logic
- `com.pharmacyerp.inventory.exception` – custom exceptions and global error handling

### Main API groups

- **Products** – `/api/v1/products`
  - Search, pagination, sort
  - Detail, update, delete
  - Manage categories and ingredients for each product
- **Categories** – `/api/v1/categories`
- **Ingredients** – `/api/v1/ingredients`
- **Measurement Units** – `/api/v1/measurement-units`

### Running the application

1. Configure PostgreSQL connection in `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
   spring.datasource.username=inventory_user
   spring.datasource.password=secret
   ```

2. Make sure the schema in `sql` is applied to the database.
3. Run the application:

   ```bash
   mvn spring-boot:run
   ```

### API documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`


