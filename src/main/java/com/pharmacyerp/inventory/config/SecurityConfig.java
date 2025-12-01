package com.pharmacyerp.inventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .httpBasic(customizer -> {})
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/actuator/health"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/**")
                            .hasAnyRole("VIEWER", "PHARMACIST", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/**")
                            .hasAnyRole("PHARMACIST", "MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/**")
                            .hasAnyRole("PHARMACIST", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/**")
                            .hasRole("MANAGER")
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails warehouseClerk = User.withUsername("user")
                .password(passwordEncoder.encode("admin"))
                .roles("MANAGER")
                .build();

        return new InMemoryUserDetailsManager(warehouseClerk);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

