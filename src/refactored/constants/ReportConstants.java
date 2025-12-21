package refactored.constants;

/**
 * Refactoring #7: Replace Magic Number with Symbolic Constant
 * 
 * This class contains all constants used in the reporting system.
 * Benefits:
 * - Eliminates magic strings scattered throughout code
 * - Provides single source of truth for constant values
 * - Makes code more maintainable and less error-prone
 */
public class ReportConstants {
    
    // Report type constants
    public static final String REPORT_TYPE_PDF = "PDF";
    public static final String REPORT_TYPE_CSV = "CSV";
    
    // Error messages
    public static final String ERROR_NO_DATA = "Error: No data available";
    public static final String ERROR_UNSUPPORTED_TYPE = "Error: Unsupported report type - ";
    
    // Status values
    public static final String STATUS_PROCESSED = "Processed";
    
    // Private constructor to prevent instantiation
    private ReportConstants() {
        throw new AssertionError("Cannot instantiate constants class");
    }
}
