package srt.model;

import srt.formatter.ReportFormatter;
import srt.formatter.ReportFormatterFactory;
import srt.processor.DataProcessor;

/**
 * Refactored ReportGenerator class.
 * 
 * This class has been refactored to apply the following techniques:
 * 1. Extract Method - generateReport() broken into smaller methods
 * 2. Replace Conditional with Polymorphism - Formatting delegated to formatter classes
 * 3. Move Method/Class - Formatting logic moved to dedicated formatter classes
 * 4. Extract Interface - Uses ReportFormatter interface
 * 5. Remove Unused Code - printStatus() method removed
 * 6. Encapsulate Field - reportType is now private with getter/setter
 * 7. Replace Magic Strings - Uses ReportConstants
 * 8. Self Encapsulate Field - rawData is now accessed via getter/setter
 */
public class ReportGenerator {
    private String reportType; // Refactoring #6: Encapsulate Field
    private String rawData;    // Refactoring #8: Self Encapsulate Field
    
    public ReportGenerator(String rawData, String reportType) {
        setRawData(rawData);      // Refactoring #8: Use setter
        setReportType(reportType); // Refactoring #6: Use setter
    }
    
    /**
     * Generates the report based on the configured report type.
     * Refactoring #1: Extract Method - This method is now much shorter and delegates to helper methods
     * 
     * @return The generated report as a string
     */
    public String generateReport() {
        // Refactoring #1: Extract Method - validation extracted
        if (!validateData()) {
            return ReportConstants.ERROR_NO_DATA; // Refactoring #7: Use constant
        }
        
        // Refactoring #1: Extract Method - processing extracted
        String processedData = processRawData();
        
        // Refactoring #1: Extract Method - formatting extracted
        return formatReport(processedData);
    }
    
    /**
     * Refactoring #1: Extract Method
     * Validates that raw data is available.
     */
    private boolean validateData() {
        String data = getRawData(); // Refactoring #8: Use getter
        return data != null && !data.isEmpty();
    }
    
    /**
     * Refactoring #1: Extract Method
     * Processes the raw data using the DataProcessor.
     */
    private String processRawData() {
        return DataProcessor.processData(getRawData()); // Refactoring #8: Use getter
    }
    
    /**
     * Refactoring #1: Extract Method
     * Refactoring #2: Replace Conditional with Polymorphism
     * Formats the report using the appropriate formatter.
     */
    private String formatReport(String processedData) {
        try {
            ReportFormatter formatter = ReportFormatterFactory.createFormatter(getReportType());
            return formatter.format(processedData);
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }
    
    // Refactoring #8: Self Encapsulate Field - Getter for rawData
    private String getRawData() {
        return rawData;
    }
    
    // Refactoring #8: Self Encapsulate Field - Setter for rawData
    private void setRawData(String rawData) {
        this.rawData = rawData;
    }
    
    // Refactoring #6: Encapsulate Field - Getter for reportType
    public String getReportType() {
        return reportType;
    }
    
    // Refactoring #6: Encapsulate Field - Setter for reportType
    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
    
    // Refactoring #5: Remove Unused Code
    // The printStatus() method has been removed as it was dead code
}
