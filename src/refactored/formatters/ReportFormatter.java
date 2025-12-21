package refactored.formatters;

import java.util.List;

/**
 * Refactoring #4: Extract Interface
 * 
 * This interface defines the contract for all report formatters.
 * Benefits:
 * - Enables polymorphism (Open/Closed Principle)
 * - Allows new formats without modifying existing code
 * - Makes testing easier with mock implementations
 * - Enforces consistent API across all formatters
 */
public interface ReportFormatter {
    
    /**
     * Formats processed data into a specific report format.
     * 
     * @param processedData List of processed data strings
     * @return Formatted report as a string
     */
    String format(List<String> processedData);
    
    /**
     * Returns the type of report this formatter produces.
     * 
     * @return Report type identifier
     */
    String getReportType();
}
