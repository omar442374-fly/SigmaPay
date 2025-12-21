package srt.formatter;

import srt.model.ReportConstants;

/**
 * PDF report formatter implementation.
 * Refactoring #2: Replace Conditional with Polymorphism
 * Refactoring #3: Move Method/Class - Formatting logic moved to dedicated class
 * This class handles PDF-specific formatting logic.
 */
public class PDFReportFormatter implements ReportFormatter {
    
    @Override
    public String format(String processedData) {
        return getHeader() + "\n" + getBody(processedData) + "\n" + getFooter();
    }
    
    @Override
    public String getHeader() {
        return "--- PDF Report Header ---";
    }
    
    @Override
    public String getBody(String processedData) {
        return "PDF formatted data: " + processedData.toUpperCase();
    }
    
    @Override
    public String getFooter() {
        return ReportConstants.DEFAULT_FOOTER;
    }
}
