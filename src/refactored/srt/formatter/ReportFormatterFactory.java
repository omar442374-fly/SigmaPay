package srt.formatter;

import srt.model.ReportConstants;

/**
 * Factory for creating appropriate ReportFormatter instances.
 * This class demonstrates the Factory Pattern and helps maintain the Open/Closed Principle.
 */
public class ReportFormatterFactory {
    
    /**
     * Creates a ReportFormatter based on the report type.
     * 
     * @param reportType The type of report (e.g., "PDF", "CSV")
     * @return The appropriate ReportFormatter implementation
     * @throws IllegalArgumentException if the report type is not supported
     */
    public static ReportFormatter createFormatter(String reportType) {
        if (ReportConstants.REPORT_TYPE_PDF.equalsIgnoreCase(reportType)) {
            return new PDFReportFormatter();
        } else if (ReportConstants.REPORT_TYPE_CSV.equalsIgnoreCase(reportType)) {
            return new CSVReportFormatter();
        } else {
            throw new IllegalArgumentException(
                ReportConstants.ERROR_UNSUPPORTED_TYPE + reportType
            );
        }
    }
}
