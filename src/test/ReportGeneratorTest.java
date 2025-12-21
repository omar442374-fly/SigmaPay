package test;

import refactored.ReportGenerator;
import refactored.formatters.PDFReportFormatter;
import refactored.formatters.CSVReportFormatter;
import refactored.formatters.ReportFormatter;
import refactored.constants.ReportConstants;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

/**
 * Test suite for the refactored Simple Reporting Tool.
 * 
 * These tests demonstrate that the refactored code:
 * 1. Produces correct output for different report types
 * 2. Handles edge cases properly
 * 3. Maintains backward compatibility with original behavior
 * 4. Allows independent testing of components
 */
public class ReportGeneratorTest {
    
    /**
     * Test PDF report generation with valid data.
     */
    public static void testPDFReportGeneration() {
        System.out.println("Test 1: PDF Report Generation with Valid Data");
        
        List<String> data = Arrays.asList("apple", "banana", "cherry");
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_PDF, data);
        String report = generator.generateReport();
        
        // Verify PDF format
        assert report.contains("===== PDF REPORT =====") : "PDF header missing";
        assert report.contains("Document Type: PDF") : "PDF document type missing";
        assert report.contains("Total Records: 3") : "Record count incorrect";
        assert report.contains("APPLE") : "Data not processed correctly";
        assert report.contains("BANANA") : "Data not processed correctly";
        assert report.contains("CHERRY") : "Data not processed correctly";
        assert report.contains("End of PDF Report") : "PDF footer missing";
        
        System.out.println("✓ PASSED: PDF report generated correctly");
        System.out.println("Sample output:\n" + report.substring(0, Math.min(200, report.length())) + "...\n");
    }
    
    /**
     * Test CSV report generation with valid data.
     */
    public static void testCSVReportGeneration() {
        System.out.println("Test 2: CSV Report Generation with Valid Data");
        
        List<String> data = Arrays.asList("item1", "item2", "item3");
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_CSV, data);
        String report = generator.generateReport();
        
        // Verify CSV format
        assert report.contains("ID,Data,Status") : "CSV header missing";
        assert report.contains("ITEM1") : "Data not processed correctly";
        assert report.contains("ITEM2") : "Data not processed correctly";
        assert report.contains("ITEM3") : "Data not processed correctly";
        assert report.contains("Processed") : "Status not included";
        
        // Verify CSV structure
        String[] lines = report.split("\n");
        assert lines.length == 4 : "CSV should have 4 lines (header + 3 data rows)";
        
        System.out.println("✓ PASSED: CSV report generated correctly");
        System.out.println("Sample output:\n" + report + "\n");
    }
    
    /**
     * Test error handling with null data.
     */
    public static void testNullDataHandling() {
        System.out.println("Test 3: Null Data Handling");
        
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_PDF, null);
        String report = generator.generateReport();
        
        assert report.equals(ReportConstants.ERROR_NO_DATA) : "Should return error for null data";
        
        System.out.println("✓ PASSED: Null data handled correctly");
        System.out.println("Output: " + report + "\n");
    }
    
    /**
     * Test error handling with empty data.
     */
    public static void testEmptyDataHandling() {
        System.out.println("Test 4: Empty Data Handling");
        
        List<String> emptyData = new ArrayList<>();
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_PDF, emptyData);
        String report = generator.generateReport();
        
        assert report.equals(ReportConstants.ERROR_NO_DATA) : "Should return error for empty data";
        
        System.out.println("✓ PASSED: Empty data handled correctly");
        System.out.println("Output: " + report + "\n");
    }
    
    /**
     * Test unsupported report type handling.
     */
    public static void testUnsupportedReportType() {
        System.out.println("Test 5: Unsupported Report Type Handling");
        
        List<String> data = Arrays.asList("data1", "data2");
        ReportGenerator generator = new ReportGenerator("INVALID", data);
        String report = generator.generateReport();
        
        assert report.contains(ReportConstants.ERROR_UNSUPPORTED_TYPE) : "Should return error for unsupported type";
        assert report.contains("INVALID") : "Error message should include the invalid type";
        
        System.out.println("✓ PASSED: Unsupported type handled correctly");
        System.out.println("Output: " + report + "\n");
    }
    
    /**
     * Test data processing (trimming and uppercase conversion).
     */
    public static void testDataProcessing() {
        System.out.println("Test 6: Data Processing");
        
        List<String> data = Arrays.asList(" lower ", "  UPPER  ", " MiXeD ");
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_CSV, data);
        String report = generator.generateReport();
        
        // All data should be trimmed and uppercased
        assert report.contains("LOWER") : "Data not trimmed/uppercased";
        assert report.contains("UPPER") : "Data not trimmed/uppercased";
        assert report.contains("MIXED") : "Data not trimmed/uppercased";
        assert !report.contains(" lower ") : "Data should be processed";
        
        System.out.println("✓ PASSED: Data processed correctly");
        System.out.println("Sample output:\n" + report + "\n");
    }
    
    /**
     * Test getter/setter functionality (Encapsulation).
     */
    public static void testEncapsulation() {
        System.out.println("Test 7: Encapsulation (Getters/Setters)");
        
        List<String> data1 = Arrays.asList("data1");
        ReportGenerator generator = new ReportGenerator(ReportConstants.REPORT_TYPE_PDF, data1);
        
        // Test getters
        assert generator.getReportType().equals(ReportConstants.REPORT_TYPE_PDF) : "Getter failed";
        assert generator.getRawData().equals(data1) : "Getter failed";
        
        // Test setters
        List<String> data2 = Arrays.asList("data2", "data3");
        generator.setReportType(ReportConstants.REPORT_TYPE_CSV);
        generator.setRawData(data2);
        
        assert generator.getReportType().equals(ReportConstants.REPORT_TYPE_CSV) : "Setter failed";
        assert generator.getRawData().equals(data2) : "Setter failed";
        
        // Generate report with new settings
        String report = generator.generateReport();
        assert report.contains("ID,Data,Status") : "CSV format not applied";
        assert report.contains("DATA2") : "New data not used";
        
        System.out.println("✓ PASSED: Encapsulation working correctly\n");
    }
    
    /**
     * Test PDF Formatter independently.
     */
    public static void testPDFFormatterIndependently() {
        System.out.println("Test 8: PDF Formatter Independent Test");
        
        ReportFormatter formatter = new PDFReportFormatter();
        List<String> processedData = Arrays.asList("DATA1", "DATA2");
        String result = formatter.format(processedData);
        
        assert formatter.getReportType().equals(ReportConstants.REPORT_TYPE_PDF) : "Report type mismatch";
        assert result.contains("PDF REPORT") : "PDF format incorrect";
        assert result.contains("DATA1") : "Data missing";
        assert result.contains("DATA2") : "Data missing";
        
        System.out.println("✓ PASSED: PDF Formatter works independently");
        System.out.println("Sample output:\n" + result.substring(0, Math.min(150, result.length())) + "...\n");
    }
    
    /**
     * Test CSV Formatter independently.
     */
    public static void testCSVFormatterIndependently() {
        System.out.println("Test 9: CSV Formatter Independent Test");
        
        ReportFormatter formatter = new CSVReportFormatter();
        List<String> processedData = Arrays.asList("DATA1", "DATA2");
        String result = formatter.format(processedData);
        
        assert formatter.getReportType().equals(ReportConstants.REPORT_TYPE_CSV) : "Report type mismatch";
        assert result.contains("ID,Data,Status") : "CSV header missing";
        assert result.contains("DATA1") : "Data missing";
        assert result.contains("DATA2") : "Data missing";
        
        System.out.println("✓ PASSED: CSV Formatter works independently");
        System.out.println("Sample output:\n" + result + "\n");
    }
    
    /**
     * Test that constants are used properly (no magic strings).
     */
    public static void testConstantsUsage() {
        System.out.println("Test 10: Constants Usage");
        
        // Verify constants exist and have expected values
        assert ReportConstants.REPORT_TYPE_PDF.equals("PDF") : "PDF constant incorrect";
        assert ReportConstants.REPORT_TYPE_CSV.equals("CSV") : "CSV constant incorrect";
        assert ReportConstants.ERROR_NO_DATA.equals("Error: No data available") : "Error constant incorrect";
        assert ReportConstants.STATUS_PROCESSED.equals("Processed") : "Status constant incorrect";
        
        System.out.println("✓ PASSED: Constants properly defined\n");
    }
    
    /**
     * Run all tests.
     */
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("  Simple Reporting Tool - Test Suite");
        System.out.println("=================================================\n");
        
        int passCount = 0;
        int totalTests = 10;
        
        try {
            testPDFReportGeneration();
            passCount++;
            
            testCSVReportGeneration();
            passCount++;
            
            testNullDataHandling();
            passCount++;
            
            testEmptyDataHandling();
            passCount++;
            
            testUnsupportedReportType();
            passCount++;
            
            testDataProcessing();
            passCount++;
            
            testEncapsulation();
            passCount++;
            
            testPDFFormatterIndependently();
            passCount++;
            
            testCSVFormatterIndependently();
            passCount++;
            
            testConstantsUsage();
            passCount++;
            
        } catch (AssertionError e) {
            System.out.println("✗ FAILED: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("✗ ERROR: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=================================================");
        System.out.println("  Test Results: " + passCount + "/" + totalTests + " passed");
        System.out.println("=================================================");
        
        if (passCount == totalTests) {
            System.out.println("✓ ALL TESTS PASSED!");
            System.exit(0);
        } else {
            System.out.println("✗ SOME TESTS FAILED");
            System.exit(1);
        }
    }
}
