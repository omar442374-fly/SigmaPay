package com.sigmapay.base;

import com.sigmapay.utils.ConfigReader;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;

import java.time.Duration;

/**
 * Base test class providing WebDriver setup and teardown
 * All test classes should extend this class
 */
public class BaseTest {
    
    protected static final Logger logger = LogManager.getLogger(BaseTest.class);
    protected WebDriver driver;
    protected String baseUrl;
    
    @BeforeMethod(alwaysRun = true)
    @Parameters({"browser"})
    public void setUp(String browser) {
        logger.info("Setting up test with browser: {}", browser);
        
        // Initialize WebDriver based on browser parameter
        driver = initializeDriver(browser);
        
        // Configure WebDriver
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        
        // Get base URL from config
        baseUrl = ConfigReader.getProperty("base.url");
        
        logger.info("Test setup completed successfully");
    }
    
    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            logger.info("Closing browser");
            driver.quit();
        }
    }
    
    /**
     * Initialize WebDriver based on browser type
     */
    private WebDriver initializeDriver(String browser) {
        WebDriver driver;
        
        switch (browser.toLowerCase()) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--disable-notifications");
                chromeOptions.addArguments("--disable-popup-blocking");
                chromeOptions.addArguments("--start-maximized");
                // Uncomment for headless mode
                // chromeOptions.addArguments("--headless");
                driver = new ChromeDriver(chromeOptions);
                break;
                
            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                firefoxOptions.addArguments("--disable-notifications");
                driver = new FirefoxDriver(firefoxOptions);
                break;
                
            case "edge":
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                edgeOptions.addArguments("--disable-notifications");
                driver = new EdgeDriver(edgeOptions);
                break;
                
            default:
                throw new IllegalArgumentException("Browser not supported: " + browser);
        }
        
        return driver;
    }
    
    /**
     * Navigate to base URL
     */
    protected void navigateToHome() {
        driver.get(baseUrl);
        logger.info("Navigated to base URL: {}", baseUrl);
    }
}
