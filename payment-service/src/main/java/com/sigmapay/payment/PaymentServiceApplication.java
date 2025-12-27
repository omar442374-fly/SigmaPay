package com.sigmapay.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * SigmaPay Payment Service - Low Latency Implementation
 * 
 * This service demonstrates multiple low-latency design patterns:
 * 1. Object Pooling - Reusable processor objects
 * 2. Caching - In-memory cache with Caffeine
 * 3. Connection Pooling - HikariCP for database
 * 4. Async Processing - CompletableFuture for non-blocking operations
 * 5. Circuit Breaker - Resilience4j for external calls
 * 6. Batch Processing - For multiple transactions
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
