package srt.formatter;

import srt.model.ReportConstants;

/**
 * CSV report formatter implementation.
 * Refactoring #2: Replace Conditional with Polymorphism
 * Refactoring #3: Move Method/Class - Formatting logic moved to dedicated class
 * This class handles CSV-specific formatting logic.
 */
public class CSVReportFormatter implements ReportFormatter {
    
    @Override
    public String format(String processedData) {
        return getHeader() + "\n" + getBody(processedData) + "\n" + getFooter();
    }
    
    @Override
    public String getHeader() {
        return "--- CSV Report Header ---";
    }
    
    @Override
    public String getBody(String processedData) {
        // Refactoring #1: Extract Method - CSV formatting extracted to separate method
        return formatCSVData(processedData);
    }
    
    @Override
    public String getFooter() {
        return ReportConstants.DEFAULT_FOOTER;
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted CSV formatting logic into a separate method for better readability.
     */
    private String formatCSVData(String processedData) {
        String[] dataLines = processedData.split(",");
        StringBuilder csvContent = new StringBuilder();
        for (String line : dataLines) {
            csvContent.append("\"").append(line.trim()).append("\",");
        }
        return "CSV Data:\n" + csvContent.toString();
    }
}
