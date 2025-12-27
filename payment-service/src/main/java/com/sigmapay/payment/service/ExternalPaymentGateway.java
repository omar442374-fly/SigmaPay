package com.sigmapay.payment.service;

import com.sigmapay.payment.model.PaymentRequest;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * LOW-LATENCY PATTERN #4: CIRCUIT BREAKER
 * 
 * Wraps external service calls with circuit breaker pattern.
 * Prevents cascading failures and provides fast-fail behavior.
 * 
 * Benefits:
 * - Fast-fail when external service is down (< 1ms vs timeout)
 * - Prevents thread exhaustion
 * - Automatic recovery testing
 * 
 * Configuration:
 * - Failure threshold: 50%
 * - Wait duration: 10s
 * - Sliding window: 10 calls
 */
@Slf4j
@Service
public class ExternalPaymentGateway {
    
    private final Random random = new Random();
    
    /**
     * Authorize payment with external gateway
     * Circuit breaker provides fallback if service is unavailable
     */
    @CircuitBreaker(name = "paymentGateway", fallbackMethod = "authorizeFallback")
    public boolean authorizePayment(PaymentRequest request) {
        // Simulate external API call
        // In production, this would call Stripe, PayPal, etc.
        
        try {
            // Simulate network latency (5-15ms)
            Thread.sleep(5 + random.nextInt(10));
            
            // Simulate 95% success rate
            if (random.nextDouble() < 0.95) {
                log.debug("External gateway authorized payment for user: {}", request.getUserId());
                return true;
            } else {
                throw new RuntimeException("Gateway declined payment");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Gateway call interrupted");
        }
    }
    
    /**
     * Fallback method when circuit is open
     * Provides fast-fail response instead of waiting for timeout
     */
    public boolean authorizeFallback(PaymentRequest request, Exception e) {
        log.warn("Circuit breaker activated for payment gateway - using fallback", e);
        // In production, might queue for retry or use backup gateway
        return false;
    }
}
