package refactored.formatters;

import refactored.constants.ReportConstants;
import java.util.List;

/**
 * Refactoring #2: Replace Conditional with Polymorphism
 * Refactoring #3: Move Method/Class
 * 
 * CSV implementation of the ReportFormatter interface.
 * Benefits:
 * - Single Responsibility: Only handles CSV formatting
 * - Open/Closed: Can add new formats without modifying this class
 * - Eliminates if/else chains in client code
 */
public class CSVReportFormatter implements ReportFormatter {
    
    @Override
    public String format(List<String> processedData) {
        StringBuilder report = new StringBuilder();
        
        // Add CSV header
        appendHeader(report);
        
        // Add data rows
        appendDataRows(report, processedData);
        
        return report.toString();
    }
    
    @Override
    public String getReportType() {
        return ReportConstants.REPORT_TYPE_CSV;
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted CSV header formatting logic into separate method.
     */
    private void appendHeader(StringBuilder report) {
        report.append("ID,Data,Status\n");
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted CSV row formatting logic into separate method.
     */
    private void appendDataRows(StringBuilder report, List<String> processedData) {
        for (int i = 0; i < processedData.size(); i++) {
            appendDataRow(report, i + 1, processedData.get(i));
        }
    }
    
    /**
     * Refactoring #1: Extract Method
     * Extracted single CSV row formatting logic into separate method.
     */
    private void appendDataRow(StringBuilder report, int id, String data) {
        report.append(id).append(",");
        report.append(data).append(",");
        report.append(ReportConstants.STATUS_PROCESSED).append("\n");
    }
}
