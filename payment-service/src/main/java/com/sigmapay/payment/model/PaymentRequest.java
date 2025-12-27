package com.sigmapay.payment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Payment request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private String userId;
    private BigDecimal amount;
    private String currency;
    private Payment.PaymentMethod method;
    private String description;
    private String merchantId;
}
