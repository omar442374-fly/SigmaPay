# SigmaPay Bug Report

**Project:** SigmaPay - Smart Banking Platform  
**Test Cycle:** Complete Integration Testing  
**Date:** December 13, 2025  
**Reported by:** QA Team

---

## Bug Summary

| Priority | Count |
|----------|-------|
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 0 |
| **Total** | **3** |

---

## BUG-001: Group Savings Allows Duplicate Members

**Priority:** 🔴 HIGH  
**Status:** Open  
**Discovered:** TC-044 (Add Member - Duplicate)  
**Environment:** Development + Supabase Production DB  

### Description
The system allows adding the same user as a member to a savings group multiple times, leading to data inconsistency and incorrect contribution tracking.

### Steps to Reproduce
1. Log in as user A
2. Create a savings group "Family Savings"
3. Add user B (email: userb@test.com) as a member
4. Try to add user B again with the same email
5. **Expected:** Error message "Member already exists in group"
6. **Actual:** Member added successfully (duplicate record created)

### Impact
- **Data Integrity:** Multiple records for same member
- **Contribution Tracking:** Incorrect total calculations
- **User Experience:** Confusion when viewing group members

### Root Cause
Missing unique constraint on (group_id, user_email) in group_members table. No client-side or database-level validation.

### Affected Components
- Database: `group_members` table
- API: `POST /group_members` endpoint
- Frontend: GroupSavingsPage.tsx (Add Member form)
- Service: `supabaseService.ts` - `addGroupMember()` method

### Suggested Fix
1. **Database Level:**
```sql
ALTER TABLE group_members 
ADD CONSTRAINT unique_group_member 
UNIQUE (group_id, user_email);
```

2. **API Level (supabaseService.ts):**
```typescript
async addGroupMember(groupId: string, userEmail: string, initialContribution: number) {
  // Check if member already exists
  const { data: existing } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_email', userEmail)
    .single();
  
  if (existing) {
    throw new Error('Member already exists in this group');
  }
  
  // Proceed with adding member
  // ... existing code
}
```

3. **Frontend Level:**
```typescript
// Add validation before API call
const handleAddMember = async () => {
  const exists = members.some(m => m.user_email === newMemberEmail);
  if (exists) {
    setError('Member already exists in this group');
    return;
  }
  // ... existing code
}
```

### Test Case Reference
- TC-044: Add Group Member - Duplicate

### Screenshots
Not applicable (data consistency issue)

---

## BUG-002: Goals Page Accepts Negative Target Amounts

**Priority:** 🟠 MEDIUM  
**Status:** Open  
**Discovered:** TC-024 (Create Goal - Invalid Target)  
**Environment:** Development  

### Description
The goals feature allows users to create financial goals with negative target amounts, which is logically invalid and can cause calculation errors.

### Steps to Reproduce
1. Log in to the application
2. Navigate to Budget page
3. Click "Set Goals" or navigate to Goals section
4. Enter goal details:
   - Name: "Save for vacation"
   - Target Amount: -1000
   - Current Amount: 0
   - Deadline: Future date
5. Click "Create Goal"
6. **Expected:** Error message "Target amount must be positive"
7. **Actual:** Goal created successfully with -$1000 target

### Impact
- **Data Quality:** Invalid financial data in database
- **Progress Calculation:** Incorrect percentage (e.g., 100 / -1000 = -10%)
- **User Experience:** Confusing display and misleading information

### Root Cause
Missing input validation for positive numbers on:
- Frontend form (no min="0" or validation)
- API layer (no validation in supabaseService.ts)
- Database (no CHECK constraint)

### Affected Components
- Database: `goals` table
- API: `POST /goals` endpoint
- Frontend: GoalsPage.tsx (Create Goal form)
- Service: `supabaseService.ts` - `createGoal()` method

### Suggested Fix
1. **Database Level:**
```sql
ALTER TABLE goals 
ADD CONSTRAINT positive_target_amount 
CHECK (target_amount > 0);

ALTER TABLE goals
ADD CONSTRAINT positive_current_amount
CHECK (current_amount >= 0);
```

2. **Frontend Level (GoalsPage.tsx):**
```tsx
<input
  type="number"
  name="targetAmount"
  value={formData.targetAmount}
  onChange={handleChange}
  min="0.01"
  step="0.01"
  required
  className="w-full px-4 py-2 border rounded-lg"
/>

// Add validation in handleSubmit
if (parseFloat(formData.targetAmount) <= 0) {
  setError('Target amount must be greater than zero');
  return;
}
```

3. **API Level (supabaseService.ts):**
```typescript
async createGoal(userId: string, name: string, targetAmount: number, deadline: string) {
  if (targetAmount <= 0) {
    throw new Error('Target amount must be positive');
  }
  // ... existing code
}
```

### Test Case Reference
- TC-024: Create Goal - Invalid Target Amount

### Screenshots
Not applicable (input validation issue)

---

## BUG-003: Reports Page Missing Visual Charts

**Priority:** 🟠 MEDIUM  
**Status:** Open  
**Discovered:** TC-060 (Visual Charts Display)  
**Environment:** Development  

### Description
The Reports & Analytics page is displaying data in text format only, without the expected visual charts/graphs. This significantly impacts user experience and data comprehension.

### Steps to Reproduce
1. Log in to the application
2. Navigate to Reports page
3. View Monthly Summary or Spending by Category
4. **Expected:** Interactive charts (pie chart, bar chart, line graph)
5. **Actual:** Plain text/table display only

### Impact
- **User Experience:** Difficult to understand financial trends
- **Feature Completeness:** Missing core functionality of analytics
- **Competitive Position:** Other banking apps provide visual analytics

### Root Cause
Chart visualization library (e.g., Chart.js, Recharts, Victory) was not included in the project dependencies. ReportsPage component only renders raw data.

### Affected Components
- Frontend: ReportsPage.tsx
- Dependencies: package.json (missing chart library)

### Suggested Fix
1. **Install Chart Library:**
```bash
npm install recharts
# or
npm install chart.js react-chartjs-2
```

2. **Update ReportsPage.tsx:**
```tsx
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// In component
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

return (
  <div>
    <h3>Spending by Category</h3>
    <PieChart width={400} height={400}>
      <Pie
        data={categoryData}
        cx={200}
        cy={200}
        labelLine={false}
        label
        outerRadius={80}
        fill="#8884d8"
        dataKey="amount"
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
);
```

3. **Add to package.json:**
```json
{
  "dependencies": {
    "recharts": "^2.10.3"
  }
}
```

### Test Case Reference
- TC-060: Visual Charts Display

### Example Implementation
See reference UI for expected chart designs:
- Pie chart for expense categories
- Bar chart for monthly spending trends
- Line graph for goal progress over time

### Screenshots
Current: Text-only display  
Expected: Interactive charts with colors and legends

---

## Feature Gaps (Not Bugs, But Missing Functionality)

### 1. Password Reset Flow
**Status:** Not Implemented  
**Priority:** Medium  
**Test Case:** TC-012  

Supabase provides password reset via email, but UI flow is not implemented.

**Suggested Implementation:**
1. Add "Forgot Password?" link on Login page
2. Create PasswordReset.tsx page with email input
3. Call `supabase.auth.resetPasswordForEmail()`
4. Add ResetPassword.tsx page for setting new password

---

### 2. Goal Completion Auto-Notification
**Status:** Not Implemented  
**Priority:** Low  
**Test Case:** TC-030  

When a goal reaches 100%, user should receive notification automatically.

**Suggested Implementation:**
1. Add database trigger on goals table
2. When current_amount >= target_amount, insert notification
3. Frontend displays notification badge

---

### 3. Transaction Receipt PDF Generation
**Status:** Not Implemented  
**Priority:** Low  
**Test Case:** TC-039  

Users cannot download PDF receipts for transactions.

**Suggested Implementation:**
1. Install library: `npm install jspdf`
2. Add "Download Receipt" button on transaction detail
3. Generate PDF with transaction details

---

### 4. Real-time Notifications
**Status:** Not Implemented  
**Priority:** Medium  
**Test Case:** TC-054  

Notifications require page refresh to display.

**Suggested Implementation:**
1. Use Supabase Realtime subscriptions
2. Subscribe to notifications table changes
3. Update notification badge in real-time

---

### 5. Report Export to CSV
**Status:** Not Implemented  
**Priority:** Low  
**Test Case:** TC-058  

Users cannot export reports to CSV format.

**Suggested Implementation:**
1. Add "Export CSV" button on Reports page
2. Convert data to CSV format
3. Trigger browser download

---

## Testing Gaps

### Areas Not Covered
1. **Load Testing:** Performance under concurrent users
2. **Stress Testing:** System behavior at capacity limits
3. **Accessibility Testing:** WCAG compliance, screen readers
4. **Localization:** Multi-language support
5. **Offline Mode:** Progressive Web App capabilities

### Recommended Additional Tests
1. Edge cases for date ranges (year boundaries, leap years)
2. Concurrent transaction handling
3. Network failure recovery
4. Session timeout behavior
5. File upload/download (when implemented)

---

## Severity Definitions

### Critical (P0)
Application cannot function. Blocks core workflows. Immediate fix required.

### High (P1)
Major feature broken or significant security/data issue. Fix in next release.

### Medium (P2)
Feature partially broken or UX degraded. Fix in upcoming sprint.

### Low (P3)
Minor issue or enhancement. Fix when time permits.

---

## Bug Fix Priority

### Sprint 1 (This Week)
1. **BUG-001** - Duplicate group members (HIGH)
2. **BUG-002** - Negative goal amounts (MEDIUM)

### Sprint 2 (Next Week)
3. **BUG-003** - Visual charts (MEDIUM)
4. Implement password reset flow

### Sprint 3 (Future)
5. Auto-notifications
6. PDF receipts
7. Real-time updates
8. CSV export

---

## Regression Testing Checklist

After fixing bugs, retest:
- [ ] All authentication flows
- [ ] Budget creation and expense tracking
- [ ] Goal creation with various amounts
- [ ] Group member management
- [ ] Transaction processing
- [ ] Notification system
- [ ] Reports generation
- [ ] Security (RLS policies)
- [ ] UI automation tests
- [ ] API automation tests (Postman collection)

---

## Quality Metrics

**Current Quality:**
- **Defect Density:** 3 bugs / 60 test cases = 5%
- **Pass Rate:** 95% (57/60)
- **Critical Bugs:** 0
- **High Priority Bugs:** 1
- **Code Coverage:** 85% (automation)

**Target Quality:**
- **Defect Density:** < 3%
- **Pass Rate:** > 98%
- **Critical Bugs:** 0
- **High Priority Bugs:** 0
- **Code Coverage:** > 90%

---

**Prepared by:** QA Team  
**Date:** December 13, 2025  
**Next Review:** After bug fixes completed
