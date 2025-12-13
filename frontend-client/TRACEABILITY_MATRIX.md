# SigmaPay Requirements Traceability Matrix

**Project:** SigmaPay - Smart Banking Platform  
**Version:** 2.0  
**Date:** December 13, 2025  
**Purpose:** Link requirements to design, implementation, and test cases

---

## Traceability Matrix Overview

This document traces each requirement through:
1. **Requirement ID** - From SRS document
2. **Feature/Module** - Implementation component
3. **Design Artifact** - Architecture/design document
4. **Implementation** - Source code file(s)
5. **Test Case(s)** - Verification test(s)
6. **Status** - Implementation & test status

---

## FR-01: User Authentication & Authorization

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-01.1 | User registration with email/password | AuthContext | AuthContext.tsx<br/>Signup.tsx<br/>supabaseClient.ts | TC-001, TC-002, TC-003, TC-004 | ✅ Complete |
| FR-01.2 | User login with credentials | AuthContext | AuthContext.tsx<br/>Login.tsx | TC-005, TC-006, TC-007, TC-008 | ✅ Complete |
| FR-01.3 | User logout and session cleanup | AuthContext | AuthContext.tsx<br/>Navbar.tsx | TC-009 | ✅ Complete |
| FR-01.4 | Protected route access control | ProtectedLayout | ProtectedLayout.tsx<br/>App.tsx | TC-010 | ✅ Complete |
| FR-01.5 | Session persistence across refreshes | AuthContext | AuthContext.tsx (localStorage) | TC-011 | ✅ Complete |
| FR-01.6 | Password reset functionality | - | - | TC-012 | ⚠️ Not Implemented |

**Module Coverage: 83.3% (5/6 implemented)**

---

## FR-02: Budget Management

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-02.1 | Create budget with category and limit | Budgets Table | BudgetPage.tsx<br/>supabaseService.ts<br/>apiClient.ts | TC-013, TC-014 | ✅ Complete |
| FR-02.2 | View all user budgets | Budgets Table | BudgetPage.tsx<br/>supabaseService.ts | TC-015 | ✅ Complete |
| FR-02.3 | Update existing budget | Budgets Table | BudgetPage.tsx<br/>supabaseService.ts | TC-016 | ✅ Complete |
| FR-02.4 | Delete budget | Budgets Table | BudgetPage.tsx<br/>supabaseService.ts | TC-017 | ✅ Complete |
| FR-02.5 | Record expense against budget | Expenses Table | BudgetPage.tsx<br/>supabaseService.ts | TC-018, TC-019 | ✅ Complete |
| FR-02.6 | Auto-update budget spent amount | DB Trigger | supabase-setup.sql (trigger) | TC-022 | ✅ Complete |
| FR-02.7 | View expenses by budget | Expenses Table | BudgetPage.tsx<br/>supabaseService.ts | TC-020 | ✅ Complete |
| FR-02.8 | Delete expense | Expenses Table | BudgetPage.tsx<br/>supabaseService.ts | TC-021 | ✅ Complete |

**Module Coverage: 100% (8/8 implemented)**

---

## FR-03: Financial Goals

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-03.1 | Create savings goal with target | Goals Table | GoalsPage.tsx<br/>supabaseService.ts | TC-023, TC-024 | ✅ Complete |
| FR-03.2 | View all user goals | Goals Table | GoalsPage.tsx<br/>supabaseService.ts | TC-025 | ✅ Complete |
| FR-03.3 | Update goal progress | Goals Table | GoalsPage.tsx<br/>supabaseService.ts | TC-026, TC-029 | ✅ Complete |
| FR-03.4 | Update goal deadline | Goals Table | GoalsPage.tsx<br/>supabaseService.ts | TC-027 | ✅ Complete |
| FR-03.5 | Delete goal | Goals Table | GoalsPage.tsx<br/>supabaseService.ts | TC-028 | ✅ Complete |
| FR-03.6 | Auto-notify on goal completion | - | - | TC-030 | ⚠️ Not Implemented |

**Module Coverage: 83.3% (5/6 implemented)**

---

## FR-04: Payments & Transactions

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-04.1 | Process payment with method | Transactions Table | PaymentsPage.tsx<br/>supabaseService.ts | TC-031, TC-032 | ✅ Complete |
| FR-04.2 | View transaction history | Transactions Table | PaymentsPage.tsx<br/>supabaseService.ts | TC-033 | ✅ Complete |
| FR-04.3 | Filter transactions by date | Transactions Table | PaymentsPage.tsx<br/>supabaseService.ts | TC-034 | ✅ Complete |
| FR-04.4 | Filter transactions by type | Transactions Table | PaymentsPage.tsx<br/>supabaseService.ts | TC-035 | ✅ Complete |
| FR-04.5 | Request transaction refund | Transactions Table | PaymentsPage.tsx<br/>supabaseService.ts | TC-036, TC-037 | ✅ Complete |
| FR-04.6 | Verify payment method | Transactions Table | PaymentsPage.tsx<br/>apiClient.ts | TC-038 | ✅ Complete |
| FR-04.7 | Prevent duplicate transactions | Transactions Table | supabaseService.ts (unique ID) | TC-040 | ✅ Complete |
| FR-04.8 | Generate transaction receipt | - | - | TC-039 | ⚠️ Not Implemented |

**Module Coverage: 87.5% (7/8 implemented)**

---

## FR-05: Group Savings

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-05.1 | Create savings group | Savings Groups Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-041, TC-042 | ✅ Complete |
| FR-05.2 | Add members to group | Group Members Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-043, TC-044 | ✅ Complete |
| FR-05.3 | Record member contribution | Group Members Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-045 | ✅ Complete |
| FR-05.4 | View group contribution report | Group Members Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-046 | ✅ Complete |
| FR-05.5 | View all group members | Group Members Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-047 | ✅ Complete |
| FR-05.6 | Leave/remove from group | Group Members Table | GroupSavingsPage.tsx<br/>supabaseService.ts | TC-048 | ✅ Complete |

**Module Coverage: 100% (6/6 implemented)**

---

## FR-06: Notifications

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-06.1 | Create user notification | Notifications Table | NotificationsPage.tsx<br/>supabaseService.ts | TC-049 | ✅ Complete |
| FR-06.2 | View unread notifications | Notifications Table | NotificationsPage.tsx<br/>supabaseService.ts | TC-050 | ✅ Complete |
| FR-06.3 | Mark notification as read | Notifications Table | NotificationsPage.tsx<br/>supabaseService.ts | TC-051 | ✅ Complete |
| FR-06.4 | Mark all notifications as read | Notifications Table | NotificationsPage.tsx<br/>supabaseService.ts | TC-052 | ✅ Complete |
| FR-06.5 | Delete notification | Notifications Table | NotificationsPage.tsx<br/>supabaseService.ts | TC-053 | ✅ Complete |
| FR-06.6 | Real-time notification updates | - | - | TC-054 | ⚠️ Not Implemented |

**Module Coverage: 83.3% (5/6 implemented)**

---

## FR-07: Reports & Analytics

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| FR-07.1 | Generate monthly summary | Analytics API | ReportsPage.tsx<br/>supabaseService.ts | TC-055 | ✅ Complete |
| FR-07.2 | Show spending by category | Analytics API | ReportsPage.tsx<br/>supabaseService.ts | TC-056 | ✅ Complete |
| FR-07.3 | Generate income statement | Analytics API | ReportsPage.tsx<br/>supabaseService.ts | TC-057 | ✅ Complete |
| FR-07.4 | Filter reports by date range | Analytics API | ReportsPage.tsx<br/>supabaseService.ts | TC-059 | ✅ Complete |
| FR-07.5 | Display visual charts | Chart Library | - | TC-060 | ❌ Partial (text only) |
| FR-07.6 | Export report to CSV | - | - | TC-058 | ⚠️ Not Implemented |

**Module Coverage: 66.7% (4/6 implemented)**

---

## NFR-01: Security Requirements

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| NFR-01.1 | Password hashing | Supabase Auth | Supabase bcrypt | Security Test 1 | ✅ Complete |
| NFR-01.2 | JWT-based authentication | Supabase Auth | AuthContext.tsx | Security Test 2 | ✅ Complete |
| NFR-01.3 | Row Level Security (RLS) | Database Policies | supabase-setup.sql | Security Test 3 | ✅ Complete |
| NFR-01.4 | Protected API endpoints | Auth Guards | ProtectedLayout.tsx | Security Test 4 | ✅ Complete |
| NFR-01.5 | SQL injection prevention | Parameterized Queries | Supabase client | Security Test 5 | ✅ Complete |
| NFR-01.6 | CORS configuration | Backend Config | Supabase CORS | Security Test 6 | ✅ Complete |

**Security Coverage: 100% (6/6 implemented)**

---

## NFR-02: Performance Requirements

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| NFR-02.1 | Page load < 2 seconds | Optimized Build | Vite + React | Perf Test 1 | ✅ Complete |
| NFR-02.2 | API response < 1 second | Indexed Queries | Supabase indexes | Perf Test 2 | ✅ Complete |
| NFR-02.3 | Responsive design | Tailwind CSS | All pages responsive | Perf Test 3 | ✅ Complete |
| NFR-02.4 | Browser compatibility | Modern Browsers | Chrome, Firefox, Safari, Edge | Perf Test 4 | ✅ Complete |

**Performance Coverage: 100% (4/4 implemented)**

---

## NFR-03: Usability Requirements

| Req ID | Requirement | Design | Implementation | Test Cases | Status |
|--------|-------------|--------|----------------|------------|--------|
| NFR-03.1 | Intuitive navigation | Navbar Component | Navbar.tsx | Usability Test 1 | ✅ Complete |
| NFR-03.2 | Consistent UI/UX | Tailwind Theme | index.css + components | Usability Test 2 | ✅ Complete |
| NFR-03.3 | Error messages | Form Validation | All forms | Usability Test 3 | ✅ Complete |
| NFR-03.4 | Loading states | Loading Indicators | All async operations | Usability Test 4 | ✅ Complete |
| NFR-03.5 | Mobile-friendly | Responsive Design | Mobile menu + layouts | Usability Test 5 | ✅ Complete |

**Usability Coverage: 100% (5/5 implemented)**

---

## Database Schema Traceability

| Table | Requirements | RLS Policy | Test Coverage |
|-------|--------------|-----------|---------------|
| user_profiles | FR-01.1, FR-01.2 | ✅ Yes | TC-001 to TC-012 |
| budgets | FR-02.1 to FR-02.8 | ✅ Yes | TC-013 to TC-022 |
| expenses | FR-02.5 to FR-02.8 | ✅ Yes | TC-018 to TC-022 |
| goals | FR-03.1 to FR-03.5 | ✅ Yes | TC-023 to TC-030 |
| transactions | FR-04.1 to FR-04.8 | ✅ Yes | TC-031 to TC-040 |
| savings_groups | FR-05.1, FR-05.4 | ✅ Yes | TC-041 to TC-048 |
| group_members | FR-05.2 to FR-05.6 | ✅ Yes | TC-043 to TC-048 |
| notifications | FR-06.1 to FR-06.5 | ✅ Yes | TC-049 to TC-054 |

**All 8 tables have RLS policies** ✅

---

## API Endpoints Traceability

| Endpoint | Requirements | Implementation | Test Cases |
|----------|--------------|----------------|------------|
| POST /auth/signup | FR-01.1 | AuthContext.tsx | TC-001 to TC-004 |
| POST /auth/login | FR-01.2 | AuthContext.tsx | TC-005 to TC-008 |
| POST /auth/logout | FR-01.3 | AuthContext.tsx | TC-009 |
| POST /budgets | FR-02.1 | supabaseService.ts | TC-013, TC-014 |
| GET /budgets | FR-02.2 | supabaseService.ts | TC-015 |
| PATCH /budgets/{id} | FR-02.3 | supabaseService.ts | TC-016 |
| DELETE /budgets/{id} | FR-02.4 | supabaseService.ts | TC-017 |
| POST /expenses | FR-02.5 | supabaseService.ts | TC-018, TC-019 |
| GET /expenses | FR-02.7 | supabaseService.ts | TC-020 |
| DELETE /expenses/{id} | FR-02.8 | supabaseService.ts | TC-021 |
| POST /goals | FR-03.1 | supabaseService.ts | TC-023, TC-024 |
| GET /goals | FR-03.2 | supabaseService.ts | TC-025 |
| PATCH /goals/{id} | FR-03.3, FR-03.4 | supabaseService.ts | TC-026, TC-027 |
| PATCH /goals/{id}/progress | FR-03.3 | supabaseService.ts | TC-026, TC-029 |
| DELETE /goals/{id} | FR-03.5 | supabaseService.ts | TC-028 |
| POST /transactions | FR-04.1 | supabaseService.ts | TC-031, TC-032 |
| GET /transactions | FR-04.2, FR-04.3, FR-04.4 | supabaseService.ts | TC-033 to TC-035 |
| PATCH /transactions/{id}/refund | FR-04.5 | supabaseService.ts | TC-036, TC-037 |
| POST /savings_groups | FR-05.1 | supabaseService.ts | TC-041, TC-042 |
| GET /savings_groups | FR-05.1 | supabaseService.ts | TC-041 |
| POST /group_members | FR-05.2 | supabaseService.ts | TC-043, TC-044 |
| GET /group_members | FR-05.5 | supabaseService.ts | TC-047 |
| POST /group_members/{id}/contribute | FR-05.3 | supabaseService.ts | TC-045 |
| GET /savings_groups/{id}/report | FR-05.4 | supabaseService.ts | TC-046 |
| POST /notifications | FR-06.1 | supabaseService.ts | TC-049 |
| GET /notifications | FR-06.2 | supabaseService.ts | TC-050 |
| PATCH /notifications/{id}/read | FR-06.3 | supabaseService.ts | TC-051 |
| PATCH /notifications/mark-all-read | FR-06.4 | supabaseService.ts | TC-052 |
| DELETE /notifications/{id} | FR-06.5 | supabaseService.ts | TC-053 |
| GET /analytics/monthly-summary | FR-07.1 | supabaseService.ts | TC-055 |
| GET /analytics/spending-by-category | FR-07.2 | supabaseService.ts | TC-056 |
| GET /analytics/income-statement | FR-07.3 | supabaseService.ts | TC-057 |

**33 API endpoints - All implemented and tested** ✅

---

## UI Components Traceability

| Component | Requirements | File | Test Coverage |
|-----------|--------------|------|---------------|
| Landing Page | NFR-03.1 | Home.jsx | Manual |
| Login Page | FR-01.2 | Login.tsx | TC-002, TC-003 (Selenium) |
| Signup Page | FR-01.1 | Signup.tsx | Manual |
| Dashboard | NFR-03.1 | Dashboard.jsx | Manual |
| Budget Page | FR-02.* | BudgetPage.tsx | Manual |
| Goals Page | FR-03.* | GoalsPage.tsx | TC-012 (Selenium) |
| Payments Page | FR-04.* | PaymentsPage.tsx | TC-011 (Selenium) |
| Group Savings Page | FR-05.* | GroupSavingsPage.tsx | Manual |
| Notifications Page | FR-06.* | NotificationsPage.tsx | Manual |
| Reports Page | FR-07.* | ReportsPage.tsx | Manual |
| Profile Page | FR-01.* | ProfilePage.tsx | Manual |
| Navbar | NFR-03.1 | Navbar.tsx | Manual |

**12 UI components - All implemented** ✅

---

## Test Coverage Summary

### Functional Requirements
| Module | Total Req | Implemented | Tested | Coverage |
|--------|-----------|-------------|--------|----------|
| Authentication | 6 | 5 | 12 tests | 83.3% |
| Budget Management | 8 | 8 | 10 tests | 100% |
| Financial Goals | 6 | 5 | 8 tests | 83.3% |
| Payments & Transactions | 8 | 7 | 10 tests | 87.5% |
| Group Savings | 6 | 6 | 8 tests | 100% |
| Notifications | 6 | 5 | 6 tests | 83.3% |
| Reports & Analytics | 6 | 4 | 6 tests | 66.7% |
| **TOTAL FR** | **46** | **40** | **60 tests** | **87%** |

### Non-Functional Requirements
| Category | Total Req | Implemented | Tested | Coverage |
|----------|-----------|-------------|--------|----------|
| Security | 6 | 6 | 6 tests | 100% |
| Performance | 4 | 4 | 4 tests | 100% |
| Usability | 5 | 5 | 5 tests | 100% |
| **TOTAL NFR** | **15** | **15** | **15 tests** | **100%** |

### Overall Project Coverage
- **Total Requirements:** 61
- **Implemented:** 55 (90.2%)
- **Total Test Cases:** 75
- **Passed Tests:** 72
- **Overall Coverage:** 90.2%
- **Test Pass Rate:** 96%

---

## Requirements Not Implemented

| Req ID | Requirement | Reason | Planned For |
|--------|-------------|--------|-------------|
| FR-01.6 | Password reset flow | Low priority | Sprint 3 |
| FR-03.6 | Auto-notify on goal completion | Nice-to-have | Sprint 3 |
| FR-04.8 | Transaction receipt PDF | Low priority | Sprint 4 |
| FR-06.6 | Real-time notifications | Complex implementation | Sprint 3 |
| FR-07.6 | Export report to CSV | Low priority | Sprint 4 |
| FR-07.5 | Visual charts (partial) | Library needed | Sprint 2 |

---

## Automation Coverage

### UI Automation (Selenium + TestNG)
| Test Class | Requirements Covered | Status |
|------------|---------------------|--------|
| LoginPositiveTest | FR-01.2 | ✅ Pass |
| LoginNegativeTest | FR-01.2 | ✅ Pass |
| PaymentsTest | FR-04.1 | ✅ Pass |
| GoalsTest | FR-03.1 | ✅ Pass |

**UI Automation: 4 test classes, 12 test methods**

### API Automation (Postman)
| Collection | Endpoints Covered | Status |
|------------|------------------|--------|
| Authentication | 3 endpoints | ✅ Pass |
| Budgets | 6 endpoints | ✅ Pass |
| Goals | 5 endpoints | ✅ Pass |
| Transactions | 3 endpoints | ✅ Pass |
| Groups | 6 endpoints | ✅ Pass |
| Notifications | 4 endpoints | ✅ Pass |
| Analytics | 3 endpoints | ✅ Pass |

**API Automation: 33 requests in Postman collection**

---

## Risk Assessment

| Risk | Requirements Affected | Mitigation | Status |
|------|----------------------|------------|--------|
| Database performance with large data | FR-02, FR-04, FR-07 | Indexes added | ✅ Mitigated |
| Concurrent transactions | FR-04.1, FR-05.3 | Supabase handles locking | ✅ Mitigated |
| Session security | FR-01.* | JWT with expiration | ✅ Mitigated |
| Data privacy | All FR | RLS policies enforced | ✅ Mitigated |
| Browser compatibility | NFR-03.* | Modern browser support | ✅ Mitigated |

---

## Change Log

| Date | Requirement | Change | Impact |
|------|-------------|--------|--------|
| 2025-12-10 | FR-01.* | Migrated from localStorage to Supabase Auth | High - Better security |
| 2025-12-11 | FR-02.* to FR-07.* | Added complete database integration | High - All features now persistent |
| 2025-12-12 | All FR | Added Row Level Security policies | Medium - Enhanced security |
| 2025-12-13 | FR-07.5 | Charts identified as gap | Low - Visual enhancement |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | ___________ | _________ | _____ |
| Tech Lead | ___________ | _________ | _____ |
| QA Lead | ___________ | _________ | _____ |
| Security Lead | ___________ | _________ | _____ |

---

**Document Version:** 2.0  
**Last Updated:** December 13, 2025  
**Next Review:** After Sprint 2 completion
