package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.*;

/**
 * Page Object for Budget Management page
 * Handles budget creation, expense recording, and budget management
 */
public class BudgetPage {
    WebDriver driver;
    
    // Budget creation form elements
    @FindBy(name="category") WebElement categoryInput;
    @FindBy(name="limit") WebElement limitInput;
    @FindBy(name="period") WebElement periodSelect;
    @FindBy(xpath="//button[contains(text(),'Create Budget')]") WebElement createBudgetBtn;
    
    // Expense recording elements
    @FindBy(name="amount") WebElement expenseAmountInput;
    @FindBy(name="description") WebElement expenseDescriptionInput;
    @FindBy(xpath="//button[contains(text(),'Record Expense')]") WebElement recordExpenseBtn;
    
    // Budget list elements
    @FindBy(className="budget-card") WebElement budgetCard;
    @FindBy(xpath="//button[contains(text(),'Delete')]") WebElement deleteBudgetBtn;
    
    // Message elements
    @FindBy(className="success-message") WebElement successMessage;
    @FindBy(className="error-message") WebElement errorMessage;
    
    public BudgetPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Create a new budget
     * @param category Budget category name
     * @param limit Budget limit amount
     * @param period Budget period
     */
    public void createBudget(String category, String limit, String period) {
        categoryInput.clear();
        categoryInput.sendKeys(category);
        limitInput.clear();
        limitInput.sendKeys(limit);
        periodSelect.sendKeys(period);
        createBudgetBtn.click();
        
        // Wait for creation
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Record an expense against a budget
     * @param amount Expense amount
     * @param description Expense description
     */
    public void recordExpense(String amount, String description) {
        expenseAmountInput.clear();
        expenseAmountInput.sendKeys(amount);
        expenseDescriptionInput.clear();
        expenseDescriptionInput.sendKeys(description);
        recordExpenseBtn.click();
        
        // Wait for recording
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Delete a budget
     */
    public void deleteBudget() {
        deleteBudgetBtn.click();
        
        // Confirm deletion if alert appears
        try {
            driver.switchTo().alert().accept();
        } catch (NoAlertPresentException e) {
            // No alert, continue
        }
        
        // Wait for deletion
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Check if budget card is visible
     * @return true if budget card exists
     */
    public boolean hasBudgetCard() {
        try {
            return budgetCard.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Check if success message is displayed
     * @return true if success message exists
     */
    public boolean hasSuccessMessage() {
        try {
            return successMessage.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Check if validation error is displayed
     * @return true if error message exists
     */
    public boolean hasValidationError() {
        try {
            return errorMessage.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}
