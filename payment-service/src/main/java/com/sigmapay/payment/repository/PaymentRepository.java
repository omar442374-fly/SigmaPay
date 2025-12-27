package com.sigmapay.payment.repository;

import com.sigmapay.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Payment repository with optimized queries
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserId(String userId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.userId = ?1 AND p.status = ?2")
    List<Payment> findByUserIdAndStatus(String userId, Payment.PaymentStatus status);
}
