package refactored;

import refactored.constants.ReportConstants;
import refactored.formatters.ReportFormatter;
import refactored.formatters.PDFReportFormatter;
import refactored.formatters.CSVReportFormatter;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Refactored version of ReportGenerator applying SOLID principles.
 * 
 * Refactorings applied:
 * 1. Extract Method - Broken down long generateReport() method
 * 2. Replace Conditional with Polymorphism - Using ReportFormatter interface
 * 3. Move Method/Class - Formatting logic moved to formatter classes
 * 4. Extract Interface - Created ReportFormatter interface
 * 5. Remove Unused Code - Removed printStatus() method
 * 6. Encapsulate Field - Made reportType private with getter/setter
 * 7. Replace Magic Number with Symbolic Constant - Using ReportConstants
 * 8. Self Encapsulate Field - Added getter/setter for rawData
 */
public class ReportGenerator {
    // Refactoring #6: Encapsulate Field - private instead of public
    private String reportType;
    
    // Refactoring #8: Self Encapsulate Field - private with getter/setter
    private List<String> rawData;
    
    private DataProcessor dataProcessor;
    private Map<String, ReportFormatter> formatters;
    
    public ReportGenerator(String reportType, List<String> rawData) {
        this.setReportType(reportType);
        this.setRawData(rawData);
        this.dataProcessor = new DataProcessor();
        this.formatters = new HashMap<>();
        initializeFormatters();
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted formatter initialization logic.
     */
    private void initializeFormatters() {
        // Refactoring #2: Replace Conditional with Polymorphism
        // Using polymorphic formatters instead of if/else
        formatters.put(ReportConstants.REPORT_TYPE_PDF, new PDFReportFormatter());
        formatters.put(ReportConstants.REPORT_TYPE_CSV, new CSVReportFormatter());
    }
    
    /**
     * Refactored generateReport method - much shorter and cleaner.
     * Refactoring #1: Extract Method - broken into smaller methods
     */
    public String generateReport() {
        // Validation
        if (!isValidData()) {
            return ReportConstants.ERROR_NO_DATA;
        }
        
        // Process data
        List<String> processedData = processData();
        
        // Format report using polymorphism
        return formatReport(processedData);
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted validation logic into separate method.
     */
    private boolean isValidData() {
        return dataProcessor.isValidData(getRawData());
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted data processing logic into separate method.
     */
    private List<String> processData() {
        return dataProcessor.processData(getRawData());
    }
    
    /**
     * Refactoring #1: Extract Method
     * Refactoring #2: Replace Conditional with Polymorphism
     * Extracted formatting logic - uses polymorphic formatter instead of if/else.
     */
    private String formatReport(List<String> processedData) {
        ReportFormatter formatter = formatters.get(getReportType());
        
        if (formatter == null) {
            return ReportConstants.ERROR_UNSUPPORTED_TYPE + getReportType();
        }
        
        return formatter.format(processedData);
    }
    
    // Refactoring #6: Encapsulate Field - getter for reportType
    public String getReportType() {
        return reportType;
    }
    
    // Refactoring #6: Encapsulate Field - setter for reportType
    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
    
    // Refactoring #8: Self Encapsulate Field - getter for rawData
    public List<String> getRawData() {
        return rawData;
    }
    
    // Refactoring #8: Self Encapsulate Field - setter for rawData
    public void setRawData(List<String> rawData) {
        this.rawData = rawData;
    }
    
    // Refactoring #5: Remove Unused Code
    // The printStatus() method has been removed as it was never used
}
