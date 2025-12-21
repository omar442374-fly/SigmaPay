package refactored.formatters;

import refactored.constants.ReportConstants;
import java.util.List;

/**
 * Refactoring #2: Replace Conditional with Polymorphism
 * Refactoring #3: Move Method/Class
 * 
 * PDF implementation of the ReportFormatter interface.
 * Benefits:
 * - Single Responsibility: Only handles PDF formatting
 * - Open/Closed: Can add new formats without modifying this class
 * - Eliminates if/else chains in client code
 */
public class PDFReportFormatter implements ReportFormatter {
    
    @Override
    public String format(List<String> processedData) {
        StringBuilder report = new StringBuilder();
        
        // Add PDF header
        appendHeader(report, processedData.size());
        
        // Add data records
        appendDataRecords(report, processedData);
        
        // Add PDF footer
        appendFooter(report);
        
        return report.toString();
    }
    
    @Override
    public String getReportType() {
        return ReportConstants.REPORT_TYPE_PDF;
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted header formatting logic into separate method.
     */
    private void appendHeader(StringBuilder report, int recordCount) {
        report.append("===== PDF REPORT =====\n");
        report.append("Document Type: PDF\n");
        report.append("Total Records: ").append(recordCount).append("\n");
        report.append("---------------------\n");
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted data records formatting logic into separate method.
     */
    private void appendDataRecords(StringBuilder report, List<String> processedData) {
        for (int i = 0; i < processedData.size(); i++) {
            report.append("Record ").append(i + 1).append(": ");
            report.append(processedData.get(i)).append("\n");
        }
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted footer formatting logic into separate method.
     */
    private void appendFooter(StringBuilder report) {
        report.append("=====================\n");
        report.append("End of PDF Report");
    }
}
