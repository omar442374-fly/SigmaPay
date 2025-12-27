package com.sigmapay.payment.controller;

import com.sigmapay.payment.model.Payment;
import com.sigmapay.payment.model.PaymentRequest;
import com.sigmapay.payment.model.PaymentResponse;
import com.sigmapay.payment.service.PaymentService;
import io.micrometer.core.annotation.Timed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Payment API Controller
 * 
 * Exposes REST endpoints for payment processing
 * All endpoints are instrumented with Micrometer for P95 monitoring
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * Process a single payment (synchronous)
     * Target: < 200ms P95 at 100 RPS
     */
    @PostMapping
    @Timed(value = "payment.process", description = "Time taken to process payment")
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentService.processPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Payment processing failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Process payment asynchronously
     */
    @PostMapping("/async")
    @Timed(value = "payment.process.async", description = "Time taken to initiate async payment")
    public CompletableFuture<ResponseEntity<PaymentResponse>> processPaymentAsync(
            @Valid @RequestBody PaymentRequest request) {
        return paymentService.processPaymentAsync(request)
                .thenApply(ResponseEntity::ok)
                .exceptionally(e -> {
                    log.error("Async payment processing failed", e);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                });
    }
    
    /**
     * Process batch payments
     */
    @PostMapping("/batch")
    @Timed(value = "payment.process.batch", description = "Time taken to process batch payments")
    public ResponseEntity<List<PaymentResponse>> processBatchPayments(
            @Valid @RequestBody List<PaymentRequest> requests) {
        try {
            List<PaymentResponse> responses = paymentService.processBatchPayments(requests);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Batch payment processing failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get payment by ID
     */
    @GetMapping("/{id}")
    @Timed(value = "payment.get", description = "Time taken to retrieve payment")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        try {
            Payment payment = paymentService.getPayment(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            log.error("Payment retrieval failed", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    /**
     * Get user payments
     */
    @GetMapping("/user/{userId}")
    @Timed(value = "payment.get.user", description = "Time taken to retrieve user payments")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable String userId) {
        List<Payment> payments = paymentService.getUserPayments(userId);
        return ResponseEntity.ok(payments);
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment service is healthy");
    }
}
