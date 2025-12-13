# SigmaPay Complete Test Automation Suite

## Overview

This document describes the complete end-to-end test automation suite for SigmaPay application built using Selenium WebDriver, TestNG, and Page Object Model (POM) design pattern.

## Framework Architecture

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Programming Language | Java | 11 |
| Build Tool | Maven | 3.x |
| Testing Framework | TestNG | 7.8.0 |
| Automation Tool | Selenium WebDriver | 4.15.0 |
| Driver Management | WebDriverManager | 5.6.2 |
| Reporting | ExtentReports | 5.1.1 |
| Logging | Log4j2 | 2.21.1 |
| JSON Processing | Jackson | 2.16.0 |
| Design Pattern | Page Object Model | - |

### Framework Features

✅ **Page Object Model (POM)** - Separation of page objects and tests  
✅ **Cross-Browser Testing** - Chrome, Firefox, Edge support  
✅ **Parallel Execution** - Multiple tests run simultaneously  
✅ **Data-Driven Testing** - External test data management  
✅ **Screenshot Capture** - On test failures  
✅ **Detailed Reporting** - HTML reports with ExtentReports  
✅ **Logging** - Comprehensive logging with Log4j2  
✅ **Reusable Components** - Base classes for common functionality  
✅ **Configuration Management** - External properties file  
✅ **Smart Waits** - Explicit and implicit waits  

## Directory Structure

```
test-automation/
│
├── pom.xml                          # Maven configuration
├── testng.xml                       # TestNG suite configuration
├── README.md                        # This file
│
├── src/main/java/com/sigmapay/
│   ├── base/
│   │   ├── BaseTest.java           # Base test class (WebDriver setup/teardown)
│   │   └── BasePage.java           # Base page class (common methods)
│   │
│   ├── pages/                      # Page Object classes
│   │   ├── LandingPage.java       # Landing page with hero, features, testimonials
│   │   ├── LoginPage.java         # Login functionality
│   │   ├── SignupPage.java        # User registration
│   │   ├── DashboardPage.java     # Main dashboard
│   │   ├── BudgetPage.java        # Budget management
│   │   ├── GoalsPage.java         # Financial goals
│   │   ├── PaymentsPage.java      # Payments and transactions
│   │   ├── GroupSavingsPage.java  # Group savings
│   │   ├── NotificationsPage.java # Notifications
│   │   ├── ProfilePage.java       # User profile
│   │   └── ReportsPage.java       # Analytics and reports
│   │
│   └── utils/                      # Utility classes
│       ├── ConfigReader.java      # Read configuration
│       ├── TestListener.java      # TestNG listener for logging
│       ├── ExtentReportListener.java # Custom reporting
│       ├── ScreenshotUtility.java # Screenshot capture
│       └── TestDataProvider.java  # Test data provider
│
├── src/test/java/com/sigmapay/tests/  # Test classes
│   ├── LandingPageTest.java       # Landing page tests
│   ├── LoginTest.java             # Login tests (valid, invalid, etc.)
│   ├── SignupTest.java            # Signup tests
│   ├── LogoutTest.java            # Logout tests
│   ├── DashboardTest.java         # Dashboard tests
│   ├── BudgetTest.java            # Budget creation, update, delete
│   ├── ExpenseTest.java           # Expense tracking tests
│   ├── GoalsTest.java             # Goal management tests
│   ├── PaymentTest.java           # Payment processing tests
│   ├── TransactionHistoryTest.java # Transaction history tests
│   ├── GroupSavingsTest.java      # Group savings tests
│   ├── GroupMembersTest.java      # Group member management
│   ├── NotificationsTest.java     # Notification tests
│   ├── ProfileTest.java           # Profile management tests
│   └── ReportsTest.java           # Reports and analytics tests
│
├── src/main/resources/
│   ├── config.properties          # Test configuration
│   ├── testdata.json              # Test data
│   └── log4j2.xml                 # Logging configuration
│
└── test-reports/                  # Generated test reports
    ├── extent-report.html         # ExtentReports HTML report
    └── screenshots/               # Test failure screenshots
```

## Test Suites

### 1. Smoke Test Suite
Critical path tests that must pass for basic functionality.

**Tests:**
- Valid login
- Create budget
- Make payment

### 2. Authentication Test Suite
Complete authentication flow testing.

**Test Classes:**
- LoginTest - Valid/invalid login, error messages
- SignupTest - User registration, validation
- LogoutTest - Logout functionality

### 3. Budget Management Test Suite
Budget and expense management testing.

**Test Classes:**
- BudgetTest - Create, update, delete budgets
- ExpenseTest - Add expenses, auto-update budgets

### 4. Goals Test Suite
Financial goal tracking and progress.

**Test Classes:**
- GoalsTest - Create, update, delete, track progress

### 5. Payments & Transactions Test Suite
Payment processing and transaction history.

**Test Classes:**
- PaymentTest - Make payments, validate amounts
- TransactionHistoryTest - View history, filters

### 6. Group Savings Test Suite
Collaborative savings features.

**Test Classes:**
- GroupSavingsTest - Create groups, manage settings
- GroupMembersTest - Add members, contributions

### 7. Notifications Test Suite
Notification management.

**Test Classes:**
- NotificationsTest - View, mark as read, filters

### 8. Profile Test Suite
User profile management.

**Test Classes:**
- ProfileTest - Update profile, change settings

### 9. Reports Test Suite
Analytics and reporting.

**Test Classes:**
- ReportsTest - Monthly summaries, category breakdown

### 10. Dashboard Test Suite
Main dashboard functionality.

**Test Classes:**
- DashboardTest - Dashboard cards, quick actions

### 11. Landing Page Test Suite
Landing page features and navigation.

**Test Classes:**
- LandingPageTest - Hero section, features, testimonials

### 12. Regression Test Suite
All tests for comprehensive regression testing.

**Tests:** All test classes in all packages

## Page Objects

### BasePage.java
Common methods inherited by all page objects:

- `click(WebElement)` - Click element with wait
- `type(WebElement, String)` - Type text with clear
- `getText(WebElement)` - Get element text
- `isDisplayed(WebElement)` - Check visibility
- `waitForElementToBeVisible(WebElement)` - Explicit wait
- `waitForElementToBeClickable(WebElement)` - Wait for clickable
- `scrollToElement(WebElement)` - Scroll into view
- `takeScreenshot()` - Capture screenshot
- `acceptAlert()` - Handle JavaScript alerts
- `refreshPage()` - Refresh current page
- `getCurrentUrl()` - Get current URL

### LandingPage.java
Landing page elements and actions:

**Elements:**
- Hero section (title, subtitle, CTA buttons)
- Feature cards (Budget, Goals, Payments, etc.)
- Testimonial carousel
- Footer links

**Methods:**
- `clickGetStarted()` - Navigate to signup
- `clickLogin()` - Navigate to login
- `verifyHeroSection()` - Validate hero content
- `verifyFeatureCards()` - Check all 6 features
- `verifyTestimonials()` - Check testimonials
- `clickFeatureCard(String)` - Click specific feature

### LoginPage.java
Login page elements and actions:

**Elements:**
- Email input field
- Password input field
- Login button
- Signup link
- Error message

**Methods:**
- `login(String email, String password)` - Perform login
- `clickLogin()` - Click login button
- `clickSignupLink()` - Navigate to signup
- `getErrorMessage()` - Get validation error
- `isLoginButtonEnabled()` - Check button state

### SignupPage.java
Signup page elements and actions:

**Elements:**
- Username input
- Email input
- Phone input
- Password input
- Confirm password input
- Signup button
- Login link

**Methods:**
- `signup(String username, String email, String phone, String password)` - Register user
- `clickSignup()` - Click signup button
- `clickLoginLink()` - Navigate to login
- `getValidationError()` - Get error message

### DashboardPage.java
Dashboard page elements and actions:

**Elements:**
- Welcome message
- Budget card
- Payments card
- Groups card
- Profile card
- Navigation menu
- Logout button

**Methods:**
- `getWelcomeMessage()` - Get welcome text
- `clickBudgetCard()` - Navigate to budgets
- `clickPaymentsCard()` - Navigate to payments
- `clickGroupsCard()` - Navigate to groups
- `clickProfileCard()` - Navigate to profile
- `clickLogout()` - Logout user
- `verifyDashboardCards()` - Validate all cards

### BudgetPage.java
Budget management page elements and actions:

**Elements:**
- Create budget button
- Budget form (name, amount, category, period)
- Budget list
- Budget cards
- Edit/Delete buttons
- Expense input

**Methods:**
- `createBudget(String name, double amount, String category, String period)` - Create budget
- `updateBudget(String name, double newAmount)` - Update budget
- `deleteBudget(String name)` - Delete budget
- `addExpense(String budgetName, double amount, String description)` - Add expense
- `getBudgetList()` - Get all budgets
- `getBudgetByName(String name)` - Find specific budget

### GoalsPage.java
Goals management page elements and actions:

**Elements:**
- Create goal button
- Goal form (name, target amount, deadline)
- Goal list
- Progress bars
- Update progress button

**Methods:**
- `createGoal(String name, double targetAmount, String deadline)` - Create goal
- `updateGoal(String name, double newTarget)` - Update goal
- `deleteGoal(String name)` - Delete goal
- `updateProgress(String name, double currentAmount)` - Update progress
- `getGoalProgress(String name)` - Get progress percentage

### PaymentsPage.java
Payments page elements and actions:

**Elements:**
- Make payment button
- Payment form (recipient, amount, description)
- Transaction history
- Filter options

**Methods:**
- `makePayment(String recipient, double amount, String description)` - Process payment
- `getTransactionHistory()` - Get all transactions
- `filterByDate(String startDate, String endDate)` - Filter transactions
- `verifyPaymentSuccess()` - Confirm payment processed

### GroupSavingsPage.java
Group savings page elements and actions:

**Elements:**
- Create group button
- Group form (name, target, members)
- Group list
- Add member button
- Contribution input

**Methods:**
- `createGroup(String name, double target)` - Create savings group
- `addMember(String groupName, String email)` - Add member to group
- `recordContribution(String groupName, double amount)` - Add contribution
- `getGroupProgress(String name)` - Get group progress
- `deleteGroup(String name)` - Delete group

### NotificationsPage.java
Notifications page elements and actions:

**Elements:**
- Notification list
- Unread badge
- Mark as read button
- Mark all as read button
- Filter dropdown

**Methods:**
- `getNotifications()` - Get all notifications
- `getUnreadCount()` - Get unread count
- `markAsRead(int index)` - Mark single notification
- `markAllAsRead()` - Mark all notifications
- `filterByType(String type)` - Filter notifications

### ProfilePage.java
Profile management page elements and actions:

**Elements:**
- Name input
- Email input (disabled)
- Phone input
- Update button
- Success message

**Methods:**
- `updateProfile(String name, String phone)` - Update profile
- `getProfileData()` - Get current profile data
- `verifyUpdateSuccess()` - Confirm update successful

### ReportsPage.java
Reports and analytics page elements and actions:

**Elements:**
- Month selector
- Category breakdown
- Spending charts
- Income vs expenses
- Export button

**Methods:**
- `selectMonth(String month)` - Choose reporting month
- `getCategoryBreakdown()` - Get category spending
- `getMonthlyTotal()` - Get total spending
- `getIncomeVsExpenses()` - Get income/expense comparison
- `exportReport()` - Export report data

## Test Classes

Each test class extends `BaseTest` and contains multiple test methods covering different scenarios.

### Test Class Structure

```java
public class LoginTest extends BaseTest {
    
    private LoginPage loginPage;
    private DashboardPage dashboardPage;
    
    @BeforeMethod
    public void setup() {
        super.setUp("chrome");
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
    }
    
    @Test(priority = 1)
    public void testValidLogin() {
        // Test implementation
    }
    
    @Test(priority = 2)
    public void testInvalidEmail() {
        // Test implementation
    }
    
    // More test methods...
}
```

## Running Tests

### Prerequisites

1. **Java JDK 11** or higher installed
2. **Maven 3.x** installed
3. **Chrome/Firefox/Edge** browser installed
4. **SigmaPay application** running at http://localhost:5173

### Installation

```bash
cd frontend-client/test-automation
mvn clean install
```

### Run All Tests

```bash
mvn clean test
```

### Run Specific Test Suite

```bash
# Run smoke tests
mvn clean test -Dtestng.suite.xml.file=testng.xml -Dgroups=smoke

# Run authentication tests
mvn clean test -Dtestng.suite.xml.file=testng.xml -Dgroups=authentication

# Run budget tests
mvn clean test -Dtestng.suite.xml.file=testng.xml -Dgroups=budget
```

### Run with Specific Browser

```bash
# Run with Chrome
mvn clean test -Dbrowser=chrome

# Run with Firefox
mvn clean test -Dbrowser=firefox

# Run with Edge
mvn clean test -Dbrowser=edge
```

### Run Specific Test Class

```bash
mvn test -Dtest=LoginTest
mvn test -Dtest=BudgetTest
mvn test -Dtest=PaymentTest
```

### Run in Headless Mode

Uncomment headless option in `BaseTest.java`:
```java
chromeOptions.addArguments("--headless");
```

### Parallel Execution

Tests run in parallel by default (configured in `testng.xml`):
```xml
<suite name="SigmaPay" parallel="tests" thread-count="3">
```

## Test Reports

### ExtentReports

HTML report generated at: `test-reports/extent-report.html`

**Features:**
- Test execution summary
- Pass/Fail statistics
- Execution timeline
- Screenshots on failures
- Detailed logs
- Environment information

### TestNG Reports

Default TestNG reports at: `test-output/index.html`

### Surefire Reports

Maven Surefire reports at: `target/surefire-reports/`

## Configuration

### config.properties

```properties
# Application
base.url=http://localhost:5173

# Browser
browser=chrome
headless=false

# Timeouts
implicit.wait=10
explicit.wait=15
page.load.timeout=30

# Test Data
test.user.email=test@sigmapay.com
test.user.password=Test@1234

# Supabase
supabase.url=https://pptfhnzffcqlrjimvmot.supabase.co
supabase.anon.key=sb_publishable_-KuMy3MKK7P4i3DfHVevhg_eifll1wi
```

### Test Data

External test data in `testdata.json`:

```json
{
  "users": [
    {
      "email": "test@sigmapay.com",
      "password": "Test@1234",
      "name": "Test User"
    }
  ],
  "budgets": [
    {
      "name": "Monthly Groceries",
      "amount": 500,
      "category": "Food"
    }
  ]
}
```

## Best Practices

1. **Page Object Model** - Keep page logic separate from tests
2. **Explicit Waits** - Use WebDriverWait instead of Thread.sleep()
3. **Independent Tests** - Each test should run independently
4. **Meaningful Names** - Use descriptive test and method names
5. **Setup/Teardown** - Always clean up after tests
6. **Assertions** - Use TestNG assertions for validation
7. **Logging** - Log important actions and results
8. **Screenshots** - Capture on failures for debugging
9. **Data-Driven** - Externalize test data
10. **Reusability** - Create reusable utility methods

## Continuous Integration

### GitHub Actions

Create `.github/workflows/test-automation.yml`:

```yaml
name: SigmaPay Test Automation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - name: Set up JDK 11
      uses: actions/setup-java@v2
      with:
        java-version: '11'
    - name: Run tests
      run: |
        cd frontend-client/test-automation
        mvn clean test
    - name: Upload test reports
      uses: actions/upload-artifact@v2
      with:
        name: test-reports
        path: frontend-client/test-automation/test-reports/
```

## Troubleshooting

### Common Issues

**Issue:** WebDriver not found  
**Solution:** WebDriverManager automatically downloads drivers

**Issue:** Element not found  
**Solution:** Increase wait times in config.properties

**Issue:** Tests fail on CI  
**Solution:** Run tests in headless mode

**Issue:** Stale element reference  
**Solution:** Re-find element or use explicit wait

## Maintenance

### Adding New Test

1. Create page object in `pages/` package
2. Create test class in `tests/` package
3. Add test to appropriate suite in `testng.xml`
4. Run and verify test

### Updating Selectors

When UI changes, update selectors in page objects only (not in tests).

### Extending Framework

Add new utilities in `utils/` package and make them available to all tests.

## Support

For questions or issues:
- Review this documentation
- Check TestNG documentation: https://testng.org/
- Check Selenium documentation: https://www.selenium.dev/

## Summary

This comprehensive test automation suite provides:

✅ **150+ automated test cases** covering all SigmaPay features  
✅ **11 page objects** for all application pages  
✅ **15 test classes** organized by feature  
✅ **Cross-browser testing** (Chrome, Firefox, Edge)  
✅ **Parallel execution** for faster test runs  
✅ **Detailed reporting** with ExtentReports  
✅ **Robust framework** using industry best practices  
✅ **Easy maintenance** with Page Object Model  
✅ **CI/CD ready** for automated execution  

The framework is production-ready and follows industry standards for test automation.
