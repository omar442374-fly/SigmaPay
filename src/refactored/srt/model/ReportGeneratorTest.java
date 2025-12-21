package srt.model;

import srt.formatter.*;
import srt.processor.DataProcessor;

/**
 * Test class to demonstrate the refactored Simple Reporting Tool.
 * This class contains simple tests to verify the functionality works correctly.
 */
public class ReportGeneratorTest {
    
    public static void main(String[] args) {
        System.out.println("=== Simple Reporting Tool - Refactored Tests ===\n");
        
        testPDFReport();
        testCSVReport();
        testInvalidReportType();
        testEmptyData();
        testNullData();
        testDataProcessor();
        testEncapsulation();
        
        System.out.println("\n=== All Tests Completed ===");
    }
    
    private static void testPDFReport() {
        System.out.println("Test 1: PDF Report Generation");
        ReportGenerator generator = new ReportGenerator("Hello World, Test Data", "PDF");
        String report = generator.generateReport();
        System.out.println(report);
        assert report.contains("PDF Report Header") : "PDF header missing";
        assert report.contains("HELLO_WORLD,_TEST_DATA") : "PDF data formatting incorrect";
        assert report.contains(ReportConstants.DEFAULT_FOOTER) : "Footer missing";
        System.out.println("✓ Test 1 Passed\n");
    }
    
    private static void testCSVReport() {
        System.out.println("Test 2: CSV Report Generation");
        ReportGenerator generator = new ReportGenerator("apple, banana, cherry", "CSV");
        String report = generator.generateReport();
        System.out.println(report);
        assert report.contains("CSV Report Header") : "CSV header missing";
        assert report.contains("\"apple\",") : "CSV data formatting incorrect";
        assert report.contains(ReportConstants.DEFAULT_FOOTER) : "Footer missing";
        System.out.println("✓ Test 2 Passed\n");
    }
    
    private static void testInvalidReportType() {
        System.out.println("Test 3: Invalid Report Type");
        ReportGenerator generator = new ReportGenerator("Test Data", "XML");
        String report = generator.generateReport();
        System.out.println(report);
        assert report.contains("Error: Unsupported report type") : "Error message missing";
        System.out.println("✓ Test 3 Passed\n");
    }
    
    private static void testEmptyData() {
        System.out.println("Test 4: Empty Data");
        ReportGenerator generator = new ReportGenerator("", "PDF");
        String report = generator.generateReport();
        System.out.println(report);
        assert report.equals(ReportConstants.ERROR_NO_DATA) : "Empty data error missing";
        System.out.println("✓ Test 4 Passed\n");
    }
    
    private static void testNullData() {
        System.out.println("Test 5: Null Data");
        ReportGenerator generator = new ReportGenerator(null, "PDF");
        String report = generator.generateReport();
        System.out.println(report);
        assert report.equals(ReportConstants.ERROR_NO_DATA) : "Null data error missing";
        System.out.println("✓ Test 5 Passed\n");
    }
    
    private static void testDataProcessor() {
        System.out.println("Test 6: Data Processor");
        String input = "Hello World Test";
        String output = DataProcessor.processData(input);
        System.out.println("Input: " + input);
        System.out.println("Output: " + output);
        assert output.equals("hello_world_test") : "Data processor output incorrect";
        System.out.println("✓ Test 6 Passed\n");
    }
    
    private static void testEncapsulation() {
        System.out.println("Test 7: Encapsulation (Getter/Setter)");
        ReportGenerator generator = new ReportGenerator("Initial Data", "PDF");
        System.out.println("Initial type: " + generator.getReportType());
        
        generator.setReportType("CSV");
        System.out.println("Changed type: " + generator.getReportType());
        assert generator.getReportType().equals("CSV") : "Setter/Getter not working";
        
        String report = generator.generateReport();
        assert report.contains("CSV Report Header") : "Report type change not reflected";
        System.out.println("✓ Test 7 Passed\n");
    }
}
