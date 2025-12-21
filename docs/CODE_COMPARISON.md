# Code Comparison: Before and After Refactoring

## Example 1: Generating a PDF Report

### Before Refactoring (Initial Code)

```java
ReportGenerator generator = new ReportGenerator("Hello World", "PDF");
String report = generator.generateReport();
// All logic is tightly coupled inside one massive method
// Hard to understand what's happening
// Hard to test individual pieces
```

**Internal Logic (from generateReport() method - ~40 lines):**
```java
public String generateReport() {
    if (rawData == null || rawData.isEmpty()) {
        return "Error: No data provided.";
    }
    String processedData = DataProcessor.processData(rawData);
    String header = "";
    String body = "";
    String footer = "--- End of Report ---";
    
    if ("PDF".equalsIgnoreCase(reportType)) {
        header = "--- PDF Report Header ---";
        body = "PDF formatted data: " + processedData.toUpperCase();
    } else if ("CSV".equalsIgnoreCase(reportType)) {
        header = "--- CSV Report Header ---";
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
```

**Problems:**
- ❌ One method doing too many things (validation, processing, formatting)
- ❌ Magic strings ("PDF", "CSV", "--- End of Report ---")
- ❌ If/else structure makes it hard to add new report types
- ❌ Can't test PDF formatting separately from CSV formatting
- ❌ Violates Single Responsibility Principle
- ❌ Violates Open/Closed Principle

---

### After Refactoring

```java
ReportGenerator generator = new ReportGenerator("Hello World", "PDF");
String report = generator.generateReport();
// Clear, simple usage - complexity hidden behind clean interface
```

**Internal Logic (ReportGenerator - main method ~8 lines):**
```java
public String generateReport() {
    if (!validateData()) {
        return ReportConstants.ERROR_NO_DATA;
    }
    String processedData = processRawData();
    return formatReport(processedData);
}

private boolean validateData() {
    String data = getRawData();
    return data != null && !data.isEmpty();
}

private String processRawData() {
    return DataProcessor.processData(getRawData());
}

private String formatReport(String processedData) {
    try {
        ReportFormatter formatter = ReportFormatterFactory.createFormatter(getReportType());
        return formatter.format(processedData);
    } catch (IllegalArgumentException e) {
        return e.getMessage();
    }
}
```

**PDF Formatting Logic (PDFReportFormatter):**
```java
public class PDFReportFormatter implements ReportFormatter {
    @Override
    public String format(String processedData) {
        return getHeader() + "\n" + getBody(processedData) + "\n" + getFooter();
    }
    
    @Override
    public String getHeader() {
        return "--- PDF Report Header ---";
    }
    
    @Override
    public String getBody(String processedData) {
        return "PDF formatted data: " + processedData.toUpperCase();
    }
    
    @Override
    public String getFooter() {
        return ReportConstants.DEFAULT_FOOTER;
    }
}
```

**Benefits:**
- ✅ Each method has a single, clear responsibility
- ✅ Constants defined in ReportConstants class
- ✅ Easy to add new report types without modifying existing code
- ✅ Each formatter can be tested independently
- ✅ Follows Single Responsibility Principle
- ✅ Follows Open/Closed Principle
- ✅ Clear separation of concerns

---

## Example 2: Adding a New Report Type

### Before Refactoring

To add an HTML report type, you would need to:

1. Modify the `generateReport()` method in ReportGenerator
2. Add another if/else branch:

```java
} else if ("CSV".equalsIgnoreCase(reportType)) {
    // CSV logic...
} else if ("HTML".equalsIgnoreCase(reportType)) {  // NEW CODE
    header = "--- HTML Report Header ---";          // NEW CODE
    body = "<html><body>" + processedData +         // NEW CODE
           "</body></html>";                        // NEW CODE
} else {
    return "Error: Unsupported report type: " + reportType;
}
```

**Problems:**
- ❌ Must modify existing, working code (violates Open/Closed Principle)
- ❌ Risk of breaking PDF or CSV formatting
- ❌ Method gets even longer
- ❌ More complex to test

---

### After Refactoring

To add an HTML report type, you:

1. Create a new HTMLReportFormatter class:

```java
package srt.formatter;

import srt.model.ReportConstants;

public class HTMLReportFormatter implements ReportFormatter {
    @Override
    public String format(String processedData) {
        return getHeader() + "\n" + getBody(processedData) + "\n" + getFooter();
    }
    
    @Override
    public String getHeader() {
        return "<html><head><title>Report</title></head><body>";
    }
    
    @Override
    public String getBody(String processedData) {
        return "<div>" + processedData + "</div>";
    }
    
    @Override
    public String getFooter() {
        return "</body></html>";
    }
}
```

2. Add one line to ReportFormatterFactory:

```java
} else if ("HTML".equalsIgnoreCase(reportType)) {
    return new HTMLReportFormatter();
```

**Benefits:**
- ✅ No changes to ReportGenerator
- ✅ No changes to PDFReportFormatter or CSVReportFormatter
- ✅ No risk of breaking existing functionality
- ✅ Easy to test in isolation
- ✅ Follows Open/Closed Principle

---

## Example 3: Testing

### Before Refactoring

Testing was difficult because everything was in one method:

```java
// How do you test just the PDF formatting logic?
// You can't - it's all bundled together!

@Test
public void testPDFFormatting() {
    // This tests EVERYTHING: validation, processing, formatting
    ReportGenerator generator = new ReportGenerator("test", "PDF");
    String report = generator.generateReport();
    assertTrue(report.contains("PDF formatted data"));
}
```

**Problems:**
- ❌ Can't test PDF formatting without also testing validation and processing
- ❌ Can't mock dependencies
- ❌ Hard to test edge cases
- ❌ Tests are brittle and coupled

---

### After Refactoring

Testing is easy because of separation of concerns:

```java
// Test just the PDF formatter
@Test
public void testPDFFormatterHeader() {
    ReportFormatter formatter = new PDFReportFormatter();
    assertEquals("--- PDF Report Header ---", formatter.getHeader());
}

@Test
public void testPDFFormatterBody() {
    ReportFormatter formatter = new PDFReportFormatter();
    String result = formatter.getBody("test_data");
    assertEquals("PDF formatted data: TEST_DATA", result);
}

// Test the ReportGenerator with a mock formatter
@Test
public void testReportGeneratorWithMockFormatter() {
    // Can inject a mock formatter for testing
    // Each component tested independently
}

// Test data validation separately
@Test
public void testEmptyDataValidation() {
    ReportGenerator generator = new ReportGenerator("", "PDF");
    String report = generator.generateReport();
    assertEquals(ReportConstants.ERROR_NO_DATA, report);
}
```

**Benefits:**
- ✅ Each component can be tested in isolation
- ✅ Tests are focused and clear
- ✅ Easy to test edge cases
- ✅ Mock dependencies when needed
- ✅ Tests are maintainable

---

## Summary of Improvements

| Aspect | Before Refactoring | After Refactoring |
|--------|-------------------|-------------------|
| **Method Length** | ~40 lines | Multiple methods of 3-8 lines |
| **Cyclomatic Complexity** | High (multiple branches) | Low (simple, focused methods) |
| **Adding New Type** | Modify existing code | Add new class only |
| **Testing** | All-or-nothing | Independent unit tests |
| **Maintainability** | Low | High |
| **Readability** | Poor | Excellent |
| **SOLID Compliance** | Violates SRP, OCP | Follows SRP, OCP, DIP |
| **Risk of Bugs** | High | Low |

The refactored code is significantly easier to understand, maintain, test, and extend!
