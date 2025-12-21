package srt.formatter;

/**
 * Interface for report formatters.
 * Refactoring #4: Extract Interface
 * This interface supports dependency inversion and makes the system more testable.
 */
public interface ReportFormatter {
    /**
     * Formats the given processed data into a report format.
     * 
     * @param processedData The data to format
     * @return The formatted report content (header + body + footer)
     */
    String format(String processedData);
    
    /**
     * Gets the header for this report format.
     * 
     * @return The header string
     */
    String getHeader();
    
    /**
     * Gets the body content for this report format.
     * 
     * @param processedData The data to include in the body
     * @return The formatted body string
     */
    String getBody(String processedData);
    
    /**
     * Gets the footer for this report format.
     * 
     * @return The footer string
     */
    String getFooter();
}
