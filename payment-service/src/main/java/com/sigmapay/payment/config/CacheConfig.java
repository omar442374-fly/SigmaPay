package com.sigmapay.payment.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * LOW-LATENCY PATTERN #2: High-Performance Caching Configuration
 * 
 * Caffeine is one of the fastest Java caching libraries:
 * - Sub-microsecond access times
 * - Window TinyLFU eviction policy
 * - Optimal concurrency with lock-free operations
 * 
 * Cache sizing for 100 RPS:
 * - User accounts: 1000 entries (covers 10 seconds of unique users)
 * - Merchants: 500 entries (merchants are less frequently accessed)
 */
@Configuration
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("userAccounts", "merchants");
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }
    
    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .maximumSize(1000) // Limit memory usage
                .expireAfterWrite(5, TimeUnit.MINUTES) // TTL
                .recordStats(); // Enable metrics
    }
}
