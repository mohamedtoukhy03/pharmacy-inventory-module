package com.pharmacyerp.inventory.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public OpenAPI inventoryModuleOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Pharmacy Inventory Module API")
                        .description("REST API for managing products, categories, ingredients and measurement units in the pharmacy ERP inventory module.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Graduation Project")
                                .email("")));
    }
}


