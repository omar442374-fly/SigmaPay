package com.sigmapay.payment.service;

import com.sigmapay.payment.cache.PaymentCacheManager;
import com.sigmapay.payment.model.Payment;
import com.sigmapay.payment.model.PaymentRequest;
import com.sigmapay.payment.model.PaymentResponse;
import com.sigmapay.payment.pool.PaymentProcessorPool;
import com.sigmapay.payment.repository.PaymentRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * LOW-LATENCY PAYMENT SERVICE
 * 
 * This service implements multiple low-latency design patterns:
 * 
 * 1. OBJECT POOLING - Reuses processor objects
 * 2. CACHING - In-memory cache for hot data
 * 3. ASYNC PROCESSING - Non-blocking operations with CompletableFuture
 * 4. CIRCUIT BREAKER - Fast-fail for external services
 * 5. CONNECTION POOLING - HikariCP for DB (configured in application.yml)
 * 6. BATCH PROCESSING - Process multiple payments efficiently
 * 
 * Target: P95 response time < 200ms at 100 RPS
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentProcessorPool processorPool;
    private final PaymentCacheManager cacheManager;
    private final ExternalPaymentGateway externalGateway;
    
    /**
     * Process a single payment with low-latency optimizations
     */
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        long startTime = System.currentTimeMillis();
        
        PaymentProcessorPool.PaymentProcessor processor = null;
        try {
            // 1. OBJECT POOLING: Acquire processor from pool
            processor = processorPool.acquire();
            processor.initialize("TXN-" + System.currentTimeMillis());
            
            // 2. CACHING: Fast validation using cached data
            PaymentCacheManager.UserAccountCache userCache = cacheManager.getUserAccount(request.getUserId());
            
            // Fast validation
            if (!userCache.isVerified()) {
                throw new RuntimeException("User not verified");
            }
            
            if (request.getAmount().doubleValue() > userCache.getDailyLimit()) {
                throw new RuntimeException("Amount exceeds daily limit");
            }
            
            // 3. Process with pooled processor
            boolean processSuccess = processor.process();
            
            if (!processSuccess) {
                throw new RuntimeException("Processing failed");
            }
            
            // 4. CIRCUIT BREAKER: External gateway call with fallback
            boolean gatewaySuccess = externalGateway.authorizePayment(request);
            
            // 5. Persist to database (using connection pool)
            Payment payment = Payment.builder()
                    .userId(request.getUserId())
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .method(request.getMethod())
                    .description(request.getDescription())
                    .merchantId(request.getMerchantId())
                    .status(gatewaySuccess ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED)
                    .completedAt(gatewaySuccess ? LocalDateTime.now() : null)
                    .build();
            
            payment = paymentRepository.save(payment);
            
            // 6. Update cache asynchronously (fire-and-forget)
            if (gatewaySuccess) {
                double newBalance = userCache.getBalance() - request.getAmount().doubleValue();
                cacheManager.updateUserBalance(request.getUserId(), newBalance);
            }
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            log.info("Payment processed in {}ms - ID: {}, Status: {}", 
                    processingTime, payment.getId(), payment.getStatus());
            
            return PaymentResponse.builder()
                    .paymentId(payment.getId())
                    .userId(payment.getUserId())
                    .amount(payment.getAmount())
                    .currency(payment.getCurrency())
                    .method(payment.getMethod())
                    .status(payment.getStatus())
                    .description(payment.getDescription())
                    .createdAt(payment.getCreatedAt())
                    .completedAt(payment.getCompletedAt())
                    .processingTimeMs(processingTime)
                    .build();
                    
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        } finally {
            // Return processor to pool
            if (processor != null) {
                processorPool.release(processor);
            }
        }
    }
    
    /**
     * LOW-LATENCY PATTERN #3: ASYNC PROCESSING
     * 
     * Process payment asynchronously for non-critical paths
     * Reduces blocking time for the caller
     */
    @Async
    public CompletableFuture<PaymentResponse> processPaymentAsync(PaymentRequest request) {
        return CompletableFuture.completedFuture(processPayment(request));
    }
    
    /**
     * LOW-LATENCY PATTERN #6: BATCH PROCESSING
     * 
     * Process multiple payments in a single transaction
     * Reduces per-request overhead and improves throughput
     */
    @Transactional
    public List<PaymentResponse> processBatchPayments(List<PaymentRequest> requests) {
        long startTime = System.currentTimeMillis();
        
        List<PaymentResponse> responses = requests.parallelStream()
                .map(this::processPayment)
                .collect(Collectors.toList());
        
        long batchTime = System.currentTimeMillis() - startTime;
        log.info("Batch of {} payments processed in {}ms ({} ms/payment)", 
                requests.size(), batchTime, batchTime / requests.size());
        
        return responses;
    }
    
    /**
     * Get payment by ID
     */
    public Payment getPayment(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    /**
     * Get user payments
     */
    public List<Payment> getUserPayments(String userId) {
        return paymentRepository.findByUserId(userId);
    }
}
