package tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import base.BaseTest;
import pages.LoginPage;
import pages.BudgetPage;

/**
 * E2E test for Budget Management feature
 * Tests creating budget and recording expenses via UI
 */
public class BudgetTest extends BaseTest {

    @Test(priority = 1, description = "Create budget and record expense flow")
    public void createBudgetAndRecordExpense() {
        // Login first
        driver.get("http://localhost:3000/login");
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("test@sigma.com", "Password123!");
        
        // Wait for redirect to dashboard
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Navigate to Budget page
        driver.get("http://localhost:3000/budget");
        BudgetPage budgetPage = new BudgetPage(driver);
        
        // Create a new budget
        budgetPage.createBudget("Groceries", "500", "food");
        
        // Verify budget was created
        Assert.assertTrue(budgetPage.hasBudgetCard(), "Budget card should be visible after creation");
        
        // Record an expense
        budgetPage.recordExpense("50.25", "Weekly grocery shopping");
        
        // Verify success message
        Assert.assertTrue(budgetPage.hasSuccessMessage(), "Success message should appear after recording expense");
    }
    
    @Test(priority = 2, description = "Create budget with validation error")
    public void createBudgetWithInvalidData() {
        // Login
        driver.get("http://localhost:3000/login");
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("test@sigma.com", "Password123!");
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Navigate to Budget page
        driver.get("http://localhost:3000/budget");
        BudgetPage budgetPage = new BudgetPage(driver);
        
        // Try to create budget with empty name
        budgetPage.createBudget("", "100", "entertainment");
        
        // Verify validation error
        Assert.assertTrue(budgetPage.hasValidationError(), "Validation error should appear for empty budget name");
    }
    
    @Test(priority = 3, description = "Delete budget")
    public void deleteBudget() {
        // Login
        driver.get("http://localhost:3000/login");
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("test@sigma.com", "Password123!");
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Navigate to Budget page
        driver.get("http://localhost:3000/budget");
        BudgetPage budgetPage = new BudgetPage(driver);
        
        // Create a budget to delete
        budgetPage.createBudget("Test Delete", "100", "other");
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Delete the budget
        budgetPage.deleteBudget();
        
        // Verify budget was deleted
        Assert.assertFalse(budgetPage.hasBudgetCard(), "Budget card should be removed after deletion");
    }
}
