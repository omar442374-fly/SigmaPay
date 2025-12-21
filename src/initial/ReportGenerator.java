public class ReportGenerator {
    private String reportType; // e.g., "PDF", "CSV"
    private String rawData;

    public ReportGenerator(String rawData, String reportType) {
        this.rawData = rawData;
        this.reportType = reportType;
    }

    public String generateReport() {
        if (rawData == null || rawData.isEmpty()) {
            return "Error: No data provided.";
        }

        // Processing Logic - Very long method!
        String processedData = DataProcessor.processData(rawData);
        String header = "";
        String body = "";
        String footer = "--- End of Report ---";

        // Logic for PDF and CSV report formats is tightly coupled
        if ("PDF".equalsIgnoreCase(reportType)) {
            header = "--- PDF Report Header ---";
            body = "PDF formatted data: " + processedData.toUpperCase();
        } else if ("CSV".equalsIgnoreCase(reportType)) {
            header = "--- CSV Report Header ---";
            // The next line simulates complex CSV formatting logic
            String[] dataLines = processedData.split(",");
            StringBuilder csvContent = new StringBuilder();
            for (String line : dataLines) {
                csvContent.append("\"").append(line.trim()).append("\",");
            }
            body = "CSV Data:\n" + csvContent.toString();
        } else {
            return "Error: Unsupported report type: " + reportType;
        }

        return header + "\n" + body + "\n" + footer;
    }

    // Unused method left over from previous development
    public void printStatus() {
        System.out.println("Generator initialized.");
    }

    // New attribute added for additional refactoring task
    public static final String DEFAULT_FOOTER = "--- End of Report ---";
}
