# Simple Reporting Tool (SRT) - Refactoring Assignment

## Overview

This project demonstrates a comprehensive refactoring of a Simple Reporting Tool (SRT) Java codebase. The project showcases the application of eight key refactoring techniques to transform poorly-designed code into a maintainable, extensible, and testable system that adheres to SOLID principles.

## Project Structure

```
SigmaPay/
├── src/
│   ├── initial/                    # Original code (before refactoring)
│   │   ├── ReportGenerator.java
│   │   └── DataProcessor.java
│   └── refactored/                 # Refactored code (after refactoring)
│       └── srt/
│           ├── model/
│           │   ├── ReportGenerator.java      # Orchestrates report generation
│           │   ├── ReportConstants.java      # System constants
│           │   └── ReportGeneratorTest.java  # Test suite
│           ├── formatter/
│           │   ├── ReportFormatter.java      # Interface for formatters
│           │   ├── PDFReportFormatter.java   # PDF implementation
│           │   ├── CSVReportFormatter.java   # CSV implementation
│           │   └── ReportFormatterFactory.java # Factory pattern
│           └── processor/
│               └── DataProcessor.java         # Data transformation
├── diagrams/
│   ├── INITIAL_CLASS_DIAGRAM.md    # UML diagram before refactoring
│   └── REFACTORED_CLASS_DIAGRAM.md # UML diagram after refactoring
└── docs/
    └── REFACTORING_REPORT.md       # Detailed refactoring report
```

## Refactoring Techniques Applied

1. **Extract Method** - Broke down long `generateReport()` method into smaller, focused methods
2. **Replace Conditional with Polymorphism** - Replaced if/else structure with formatter hierarchy
3. **Move Method/Class** - Moved formatting logic to dedicated formatter classes
4. **Extract Interface** - Created `ReportFormatter` interface for dependency inversion
5. **Remove Unused Code** - Eliminated dead `printStatus()` method
6. **Encapsulate Field** - Added getters/setters for `reportType`
7. **Replace Magic Strings** - Created `ReportConstants` class for all constants
8. **Self Encapsulate Field** - Added private getters/setters for `rawData`

## Design Principles Achieved

- **Single Responsibility Principle (SRP)**: Each class has one clear responsibility
- **Open/Closed Principle (OCP)**: System is open for extension, closed for modification
- **Dependency Inversion Principle (DIP)**: High-level modules depend on abstractions

## How to Compile and Run

### Compile the Refactored Code

```bash
cd src/refactored
javac srt/model/*.java srt/formatter/*.java srt/processor/*.java
```

### Run the Tests

```bash
cd src/refactored
java -ea srt.model.ReportGeneratorTest
```

### Using the Refactored Code

```java
import srt.model.ReportGenerator;

// Create a PDF report
ReportGenerator pdfGenerator = new ReportGenerator("Hello World, Test Data", "PDF");
String pdfReport = pdfGenerator.generateReport();
System.out.println(pdfReport);

// Create a CSV report
ReportGenerator csvGenerator = new ReportGenerator("apple, banana, cherry", "CSV");
String csvReport = csvGenerator.generateReport();
System.out.println(csvReport);

// Change report type dynamically
pdfGenerator.setReportType("CSV");
String changedReport = pdfGenerator.generateReport();
```

## Key Features

### Before Refactoring (Design Smells)
- ❌ Long method with multiple responsibilities
- ❌ Tight coupling between report types
- ❌ Magic strings scattered throughout code
- ❌ Dead code present
- ❌ Poor encapsulation
- ❌ Violates Open/Closed Principle
- ❌ Hard to test and extend

### After Refactoring (Clean Design)
- ✅ Short, focused methods with single responsibilities
- ✅ Loose coupling through interfaces
- ✅ All constants defined in one place
- ✅ No dead code
- ✅ Proper encapsulation with getters/setters
- ✅ Follows Open/Closed Principle
- ✅ Easy to test and extend

## Adding New Report Types

To add a new report type (e.g., HTML):

1. Create a new formatter class:
```java
package srt.formatter;

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
        return "<p>" + processedData + "</p>";
    }
    
    @Override
    public String getFooter() {
        return "</body></html>";
    }
}
```

2. Add constant to `ReportConstants`:
```java
public static final String REPORT_TYPE_HTML = "HTML";
```

3. Update `ReportFormatterFactory`:
```java
public static ReportFormatter createFormatter(String reportType) {
    if (ReportConstants.REPORT_TYPE_PDF.equalsIgnoreCase(reportType)) {
        return new PDFReportFormatter();
    } else if (ReportConstants.REPORT_TYPE_CSV.equalsIgnoreCase(reportType)) {
        return new CSVReportFormatter();
    } else if (ReportConstants.REPORT_TYPE_HTML.equalsIgnoreCase(reportType)) {
        return new HTMLReportFormatter();
    } else {
        throw new IllegalArgumentException(
            ReportConstants.ERROR_UNSUPPORTED_TYPE + reportType
        );
    }
}
```

No changes needed to `ReportGenerator` or existing formatters!

## Deliverables

✅ **Initial Class Diagram** - Located in `diagrams/INITIAL_CLASS_DIAGRAM.md`

✅ **Refactored Java Code** - Located in `src/refactored/srt/`
   - Properly organized into packages: model, formatter, processor
   - All 8 refactoring techniques applied
   - Compiles and runs successfully

✅ **Refactored Class Diagram** - Located in `diagrams/REFACTORED_CLASS_DIAGRAM.md`
   - Shows all new classes, interfaces, and relationships
   - Illustrates inheritance and composition

✅ **Refactoring Report** - Located in `docs/REFACTORING_REPORT.md`
   - 750+ words explaining each refactoring technique
   - References to SRP, OCP, and maintainability improvements
   - Clear explanation of design benefits

## Testing

The project includes comprehensive tests in `ReportGeneratorTest.java`:
- PDF report generation
- CSV report generation
- Invalid report type handling
- Empty data validation
- Null data validation
- Data processor functionality
- Encapsulation (getter/setter) verification

All tests pass successfully! ✓

## License

This project is part of an academic refactoring assignment for educational purposes.

## Author

Created as a refactoring assignment solution demonstrating best practices in object-oriented design and SOLID principles.
