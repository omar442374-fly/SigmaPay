package com.sigmapay.payment.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment transaction entity
 */
@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_user_id", columnList = "userId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "createdAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(nullable = false)
    private String userId;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @NotNull
    @Column(nullable = false)
    private String currency;
    
    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;
    
    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    @Column(length = 500)
    private String description;
    
    private String merchantId;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
    
    @Column(length = 1000)
    private String metadata;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
    }
    
    public enum PaymentMethod {
        CARD, WALLET, BANK_TRANSFER, GROUP_CONTRIBUTION
    }
    
    public enum PaymentStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
