package initial;

import java.util.List;

/**
 * Initial version of ReportGenerator with code smells.
 * This class demonstrates several anti-patterns that need refactoring:
 * - Long method (generateReport)
 * - If/else chain for report types
 * - Magic numbers/strings ("PDF", "CSV")
 * - Public fields (reportType, rawData)
 * - Unused method (printStatus)
 * - Poor encapsulation
 */
public class ReportGenerator {
    // Code smell: Public field - violates encapsulation
    public String reportType;
    
    // Code smell: Public field - violates encapsulation
    public List<String> rawData;
    
    private DataProcessor dataProcessor;
    
    public ReportGenerator(String reportType, List<String> rawData) {
        this.reportType = reportType;
        this.rawData = rawData;
        this.dataProcessor = new DataProcessor();
    }
    
    /**
     * Code smell: Long method that does too many things
     * - Validates data
     * - Processes data
     * - Formats report (with if/else chain)
     * - Returns formatted report
     */
    public String generateReport() {
        // Validation
        if (rawData == null || rawData.isEmpty()) {
            return "Error: No data available";
        }
        
        // Process data
        List<String> processedData = dataProcessor.processData(rawData);
        
        // Code smell: Magic strings "PDF" and "CSV"
        // Code smell: If/else chain for polymorphic behavior
        if (reportType.equals("PDF")) {
            // PDF formatting logic
            StringBuilder report = new StringBuilder();
            report.append("===== PDF REPORT =====\n");
            report.append("Document Type: PDF\n");
            report.append("Total Records: ").append(processedData.size()).append("\n");
            report.append("---------------------\n");
            for (int i = 0; i < processedData.size(); i++) {
                report.append("Record ").append(i + 1).append(": ");
                report.append(processedData.get(i)).append("\n");
            }
            report.append("=====================\n");
            report.append("End of PDF Report");
            return report.toString();
        } else if (reportType.equals("CSV")) {
            // CSV formatting logic
            StringBuilder report = new StringBuilder();
            report.append("ID,Data,Status\n");
            for (int i = 0; i < processedData.size(); i++) {
                report.append(i + 1).append(",");
                report.append(processedData.get(i)).append(",");
                report.append("Processed\n");
            }
            return report.toString();
        } else {
            return "Error: Unsupported report type - " + reportType;
        }
    }
    
    /**
     * Code smell: Unused method - should be removed
     */
    public void printStatus() {
        System.out.println("Report type: " + reportType);
        System.out.println("Data size: " + (rawData != null ? rawData.size() : 0));
    }
}
