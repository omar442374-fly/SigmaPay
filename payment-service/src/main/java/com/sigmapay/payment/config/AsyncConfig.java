package com.sigmapay.payment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Async processing configuration
 * 
 * Optimized thread pool for async operations:
 * - Core pool: 10 threads
 * - Max pool: 50 threads  
 * - Queue capacity: 100
 * 
 * Sized for 100 RPS with async processing
 */
@Configuration
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-payment-");
        executor.initialize();
        return executor;
    }
}
