package srt.model;

/**
 * Constants for the Simple Reporting Tool.
 * Refactoring #7: Replace Magic Strings with Symbolic Constants
 */
public final class ReportConstants {
    // Report type constants
    public static final String REPORT_TYPE_PDF = "PDF";
    public static final String REPORT_TYPE_CSV = "CSV";
    
    // Footer constant
    public static final String DEFAULT_FOOTER = "--- End of Report ---";
    
    // Error messages
    public static final String ERROR_NO_DATA = "Error: No data provided.";
    public static final String ERROR_UNSUPPORTED_TYPE = "Error: Unsupported report type: ";
    
    // Private constructor to prevent instantiation
    private ReportConstants() {
        throw new AssertionError("Cannot instantiate constants class");
    }
}
