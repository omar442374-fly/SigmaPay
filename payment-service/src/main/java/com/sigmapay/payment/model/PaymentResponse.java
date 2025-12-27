package com.sigmapay.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long paymentId;
    private String userId;
    private BigDecimal amount;
    private String currency;
    private Payment.PaymentMethod method;
    private Payment.PaymentStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Long processingTimeMs;
}
