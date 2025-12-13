# SigmaPay Test Automation - Quick Start Guide

## Prerequisites

- Java JDK 11 or higher
- Maven 3.x
- Chrome, Firefox, or Edge browser
- SigmaPay application running at http://localhost:5173

## Installation

```bash
cd frontend-client/test-automation
mvn clean install
```

## Run Tests

### Run All Tests
```bash
mvn clean test
```

### Run Smoke Tests (Quick validation)
```bash
mvn clean test -Dgroups=smoke
```

### Run Specific Feature
```bash
# Authentication tests
mvn test -Dtest=LoginTest

# Budget tests
mvn test -Dtest=BudgetTest

# Payment tests
mvn test -Dtest=PaymentTest
```

### Run with Different Browser
```bash
mvn clean test -Dbrowser=chrome
mvn clean test -Dbrowser=firefox
mvn clean test -Dbrowser=edge
```

## View Reports

After test execution:

1. **ExtentReport:** Open `test-reports/extent-report.html` in browser
2. **TestNG Report:** Open `test-output/index.html` in browser

## Test Structure

```
test-automation/
├── pom.xml                     # Maven dependencies
├── testng.xml                  # Test suite configuration
├── src/main/java/
│   ├── base/                   # Base classes
│   ├── pages/                  # Page objects (11 classes)
│   └── utils/                  # Utilities
└── src/test/java/tests/        # Test classes (15 classes)
```

## Test Suites

1. **Smoke Tests** - Critical path (Login, Budget, Payment)
2. **Authentication** - Login, Signup, Logout
3. **Budget Management** - Budgets and Expenses
4. **Goals** - Goal management
5. **Payments** - Payments and Transactions
6. **Group Savings** - Groups and Members
7. **Notifications** - Notification management
8. **Profile** - Profile management
9. **Reports** - Analytics and reports
10. **Dashboard** - Dashboard functionality
11. **Landing Page** - Landing page features

## Configuration

Edit `src/main/resources/config.properties`:

```properties
base.url=http://localhost:5173
browser=chrome
test.user.email=test@sigmapay.com
test.user.password=Test@1234
```

## Framework Features

✅ Page Object Model (POM)  
✅ Cross-browser testing  
✅ Parallel execution  
✅ ExtentReports  
✅ Screenshot on failure  
✅ Data-driven testing  
✅ Logging with Log4j2  

## Common Commands

```bash
# Clean and run all tests
mvn clean test

# Run specific test class
mvn test -Dtest=LoginTest

# Run tests in parallel
mvn clean test -DthreadCount=3

# Skip tests
mvn clean install -DskipTests

# Generate surefire reports
mvn surefire-report:report
```

## Troubleshooting

**Tests fail to start:**
- Check Java version: `java -version`
- Check Maven version: `mvn -version`
- Ensure application is running at http://localhost:5173

**Browser issues:**
- WebDriverManager automatically downloads drivers
- Try different browser: `-Dbrowser=firefox`

**Element not found:**
- Increase wait time in `config.properties`
- Check if application is fully loaded

## Next Steps

1. Review full documentation: `TEST_AUTOMATION_GUIDE.md`
2. Explore page objects in `src/main/java/pages/`
3. Explore test classes in `src/test/java/tests/`
4. Add new tests as needed

## Support

- Full Guide: See `TEST_AUTOMATION_GUIDE.md`
- TestNG Docs: https://testng.org/
- Selenium Docs: https://www.selenium.dev/

Happy Testing! 🚀
