# Refactoring Report

## CSE352 Assignment 5: Simple Reporting Tool Refactoring

**Student**: [Your Name]  
**Date**: December 21, 2025  
**Course**: CSE352 - Software Engineering

---

## Executive Summary

This report documents the comprehensive refactoring of a Simple Reporting Tool (SRT) codebase. The initial implementation contained several code smells and violated SOLID principles. Through the application of 8 specific refactoring techniques, the codebase was transformed into a maintainable, extensible, and well-designed system.

**Key Results:**
- Reduced method complexity from 40+ lines to ~8 lines in main method
- Eliminated all public fields (improved encapsulation)
- Removed magic strings and replaced with symbolic constants
- Replaced if/else chains with polymorphic design
- Achieved 100% adherence to SOLID principles

---

## Refactoring Techniques Applied

### 1. Extract Method

**Definition**: Break down long methods into smaller, focused methods with descriptive names.

**Problem in Initial Code:**
The `generateReport()` method was 40+ lines long and performed multiple responsibilities:
- Data validation
- Data processing
- Report formatting (with complex if/else logic)

```java
// BEFORE - Long, complex method
public String generateReport() {
    // Validation
    if (rawData == null || rawData.isEmpty()) {
        return "Error: No data available";
    }
    
    // Process data
    List<String> processedData = dataProcessor.processData(rawData);
    
    // PDF formatting logic (15+ lines)
    if (reportType.equals("PDF")) {
        StringBuilder report = new StringBuilder();
        report.append("===== PDF REPORT =====\n");
        // ... many more lines ...
    } 
    // CSV formatting logic (10+ lines)
    else if (reportType.equals("CSV")) {
        // ... many more lines ...
    }
}
```

**Solution Applied:**
Extracted smaller, focused methods:
- `isValidData()` - handles validation
- `processData()` - handles data processing
- `formatReport()` - handles formatting delegation

Additionally, within formatters:
- `appendHeader()` - formats header section
- `appendDataRecords()` / `appendDataRows()` - formats data section
- `appendFooter()` - formats footer section

```java
// AFTER - Clean, readable method
public String generateReport() {
    if (!isValidData()) {
        return ReportConstants.ERROR_NO_DATA;
    }
    List<String> processedData = processData();
    return formatReport(processedData);
}

private boolean isValidData() {
    return dataProcessor.isValidData(getRawData());
}

private List<String> processData() {
    return dataProcessor.processData(getRawData());
}

private String formatReport(List<String> processedData) {
    ReportFormatter formatter = formatters.get(getReportType());
    if (formatter == null) {
        return ReportConstants.ERROR_UNSUPPORTED_TYPE + getReportType();
    }
    return formatter.format(processedData);
}
```

**Benefits:**
- ✓ Improved readability - each method has single, clear purpose
- ✓ Easier to test - can test validation, processing, formatting separately
- ✓ Reduced cognitive load - understand one small piece at a time
- ✓ Better maintainability - changes are localized to specific methods

---

### 2. Replace Conditional with Polymorphism

**Definition**: Replace type-checking conditionals (if/else or switch) with polymorphic method calls.

**Problem in Initial Code:**
Used if/else chain to determine formatting logic based on report type:

```java
// BEFORE - Conditional logic
if (reportType.equals("PDF")) {
    // PDF formatting logic (15 lines)
    StringBuilder report = new StringBuilder();
    report.append("===== PDF REPORT =====\n");
    // ...
} else if (reportType.equals("CSV")) {
    // CSV formatting logic (10 lines)
    StringBuilder report = new StringBuilder();
    report.append("ID,Data,Status\n");
    // ...
} else {
    return "Error: Unsupported report type";
}
```

**Solution Applied:**
Created polymorphic hierarchy with `ReportFormatter` interface and concrete implementations:

```java
// AFTER - Polymorphic design

// Interface
public interface ReportFormatter {
    String format(List<String> processedData);
    String getReportType();
}

// PDF Implementation
public class PDFReportFormatter implements ReportFormatter {
    @Override
    public String format(List<String> processedData) {
        // PDF-specific formatting
    }
}

// CSV Implementation
public class CSVReportFormatter implements ReportFormatter {
    @Override
    public String format(List<String> processedData) {
        // CSV-specific formatting
    }
}

// Usage in ReportGenerator
private String formatReport(List<String> processedData) {
    ReportFormatter formatter = formatters.get(getReportType());
    return formatter.format(processedData);  // Polymorphic call
}
```

**Benefits:**
- ✓ **Open/Closed Principle**: Can add new formats without modifying existing code
- ✓ Eliminated conditional complexity
- ✓ Each format encapsulated in its own class (Single Responsibility)
- ✓ Format-specific logic is isolated and easier to maintain

**Example Extension:**
Adding a new JSON format requires only:
```java
public class JSONReportFormatter implements ReportFormatter {
    // Implement format() and getReportType()
}
// Register: formatters.put("JSON", new JSONReportFormatter());
```
No changes to existing code needed!

---

### 3. Move Method/Class

**Definition**: Move methods or classes to more appropriate locations in the design.

**Problem in Initial Code:**
All formatting logic was embedded in `ReportGenerator` class:
- PDF formatting logic (15+ lines)
- CSV formatting logic (10+ lines)
- Both mixed with generation orchestration logic

This violated Single Responsibility Principle - `ReportGenerator` had too many responsibilities.

**Solution Applied:**
Created separate package structure and moved formatting logic:

```
src/refactored/
├── ReportGenerator.java (orchestration only)
├── DataProcessor.java
├── formatters/
│   ├── ReportFormatter.java (interface)
│   ├── PDFReportFormatter.java (PDF logic moved here)
│   └── CSVReportFormatter.java (CSV logic moved here)
└── constants/
    └── ReportConstants.java
```

**Before**: 1 class with 3 responsibilities  
**After**: 5 classes, each with 1 clear responsibility

**Benefits:**
- ✓ Clear separation of concerns
- ✓ Better package organization
- ✓ Each class has single responsibility
- ✓ Easier to locate and modify specific functionality
- ✓ Improved testability (can test formatters independently)

---

### 4. Extract Interface

**Definition**: Create an interface to define a contract, allowing multiple implementations.

**Problem in Initial Code:**
No abstraction for different report formats. Adding new formats required:
- Modifying `ReportGenerator` class
- Adding more if/else branches
- Duplicating structure

**Solution Applied:**
Created `ReportFormatter` interface:

```java
public interface ReportFormatter {
    /**
     * Formats processed data into specific report format.
     */
    String format(List<String> processedData);
    
    /**
     * Returns the type of report this formatter produces.
     */
    String getReportType();
}
```

**Benefits:**
- ✓ **Dependency Inversion Principle**: Depend on abstraction, not concrete classes
- ✓ **Liskov Substitution Principle**: All implementations are substitutable
- ✓ Enables polymorphism (see Refactoring #2)
- ✓ Easy to mock for testing
- ✓ Clear contract for all formatters

**Design Impact:**
```java
// Before: Direct dependency on concrete logic
if (reportType.equals("PDF")) { /* concrete PDF code */ }

// After: Dependency on interface
ReportFormatter formatter = formatters.get(reportType);
formatter.format(data);  // Works with any implementation
```

---

### 5. Remove Unused Code

**Definition**: Delete code that is not being used (dead code).

**Problem in Initial Code:**
The `printStatus()` method was defined but never called anywhere:

```java
// BEFORE - Unused method
public void printStatus() {
    System.out.println("Report type: " + reportType);
    System.out.println("Data size: " + (rawData != null ? rawData.size() : 0));
}
```

**Solution Applied:**
Removed the unused method entirely from refactored code.

**Benefits:**
- ✓ Reduced code clutter
- ✓ Less maintenance burden
- ✓ Clearer codebase
- ✓ Faster compile times
- ✓ Reduced cognitive load for developers

**Why This Matters:**
- Dead code creates confusion ("Is this used? Should I maintain it?")
- Increases maintenance cost
- May contain bugs that never manifest but still need fixing
- Makes codebase appear larger and more complex than it is

---

### 6. Encapsulate Field

**Definition**: Make fields private and provide public getter/setter methods.

**Problem in Initial Code:**
The `reportType` field was public, violating encapsulation:

```java
// BEFORE - Public field
public class ReportGenerator {
    public String reportType;  // Bad: direct access allowed
    
    public ReportGenerator(String reportType, List<String> rawData) {
        this.reportType = reportType;
        // ...
    }
}

// Client code could do:
ReportGenerator gen = new ReportGenerator("PDF", data);
gen.reportType = "INVALID";  // Oops! No validation
```

**Solution Applied:**
Made field private with public getter/setter:

```java
// AFTER - Encapsulated field
public class ReportGenerator {
    private String reportType;  // Good: controlled access
    
    public String getReportType() {
        return reportType;
    }
    
    public void setReportType(String reportType) {
        // Can add validation here if needed
        this.reportType = reportType;
    }
}

// Client code must use accessors:
ReportGenerator gen = new ReportGenerator("PDF", data);
gen.setReportType("CSV");  // Controlled access
```

**Benefits:**
- ✓ **Information Hiding**: Internal representation hidden
- ✓ **Flexibility**: Can change internal implementation without affecting clients
- ✓ **Validation**: Can add validation logic in setter
- ✓ **Debugging**: Can add logging/breakpoints in accessors
- ✓ **Thread Safety**: Can add synchronization if needed

---

### 7. Replace Magic Number with Symbolic Constant

**Definition**: Replace hardcoded literal values with named constants.

**Problem in Initial Code:**
Magic strings scattered throughout code:

```java
// BEFORE - Magic strings everywhere
if (reportType.equals("PDF")) {  // Magic string "PDF"
    report.append("===== PDF REPORT =====\n");
    // ...
} else if (reportType.equals("CSV")) {  // Magic string "CSV"
    report.append("ID,Data,Status\n");
    // ...
} else {
    return "Error: Unsupported report type";  // Magic string
}
```

**Problems:**
- Typos cause bugs: `if (reportType.equals("PdF"))` - silent failure
- Hard to change: Must find and update all occurrences
- No single source of truth
- IDE can't help with refactoring

**Solution Applied:**
Created `ReportConstants` class:

```java
public class ReportConstants {
    // Report type constants
    public static final String REPORT_TYPE_PDF = "PDF";
    public static final String REPORT_TYPE_CSV = "CSV";
    
    // Error messages
    public static final String ERROR_NO_DATA = "Error: No data available";
    public static final String ERROR_UNSUPPORTED_TYPE = "Error: Unsupported report type - ";
    
    // Status values
    public static final String STATUS_PROCESSED = "Processed";
    
    private ReportConstants() {
        throw new AssertionError("Cannot instantiate constants class");
    }
}
```

Usage:
```java
// AFTER - Named constants
if (reportType.equals(ReportConstants.REPORT_TYPE_PDF)) {
    // ...
}

formatters.put(ReportConstants.REPORT_TYPE_PDF, new PDFReportFormatter());
formatters.put(ReportConstants.REPORT_TYPE_CSV, new CSVReportFormatter());
```

**Benefits:**
- ✓ **Single Source of Truth**: Change value in one place
- ✓ **Compile-Time Checking**: Typos caught by compiler
- ✓ **Self-Documenting**: Name explains meaning
- ✓ **IDE Support**: Auto-complete, find usages, rename refactoring
- ✓ **Maintainability**: Easy to update all usages

**Example:**
To change "PDF" to "pdf":
- Before: Search entire codebase for "PDF" string, manually check each occurrence
- After: Change `REPORT_TYPE_PDF = "pdf"` in one place, done!

---

### 8. Self Encapsulate Field

**Definition**: Access fields through getters/setters even within the same class.

**Problem in Initial Code:**
Direct field access, including from within class:

```java
// BEFORE - Direct field access
public class ReportGenerator {
    public List<String> rawData;
    
    public String generateReport() {
        if (rawData == null || rawData.isEmpty()) {  // Direct access
            return "Error";
        }
        List<String> processed = dataProcessor.processData(rawData);  // Direct access
        // ...
    }
}
```

**Solution Applied:**
Added getter/setter and used them consistently:

```java
// AFTER - Self-encapsulated field
public class ReportGenerator {
    private List<String> rawData;
    
    public List<String> getRawData() {
        return rawData;
    }
    
    public void setRawData(List<String> rawData) {
        this.rawData = rawData;
    }
    
    public String generateReport() {
        if (!isValidData()) {  // Uses getter internally
            return ReportConstants.ERROR_NO_DATA;
        }
        List<String> processed = processData();  // Uses getter internally
        return formatReport(processed);
    }
    
    private boolean isValidData() {
        return dataProcessor.isValidData(getRawData());  // Using getter
    }
    
    private List<String> processData() {
        return dataProcessor.processData(getRawData());  // Using getter
    }
}
```

**Benefits:**
- ✓ **Consistency**: Same access pattern everywhere (inside and outside class)
- ✓ **Flexibility**: Can change how data is stored internally without affecting callers
- ✓ **Lazy Initialization**: Getter can initialize field on first access
- ✓ **Validation**: Can validate in setter before storing
- ✓ **Computed Properties**: Getter can compute value instead of storing
- ✓ **Debugging**: Single point to add breakpoint for all access

**Example Extension:**
```java
// Can later change implementation without breaking anything:
public List<String> getRawData() {
    if (rawData == null) {
        rawData = new ArrayList<>();  // Lazy initialization
    }
    return new ArrayList<>(rawData);  // Defensive copy
}
```

---

## Summary of Improvements

### Before Refactoring:
| Metric | Value |
|--------|-------|
| Number of Classes | 2 |
| Number of Interfaces | 0 |
| Public Fields | 2 |
| Lines in generateReport() | 40+ |
| Cyclomatic Complexity | High (multiple branches) |
| SOLID Compliance | Low |
| Magic Strings | 5+ occurrences |
| Dead Code | 1 method |

### After Refactoring:
| Metric | Value |
|--------|-------|
| Number of Classes | 5 |
| Number of Interfaces | 1 |
| Public Fields | 0 ✓ |
| Lines in generateReport() | 8 ✓ |
| Cyclomatic Complexity | Low ✓ |
| SOLID Compliance | High ✓ |
| Magic Strings | 0 ✓ |
| Dead Code | 0 ✓ |

### SOLID Principles Achieved:

1. **Single Responsibility Principle** ✓
   - Each class has one clear responsibility
   - ReportGenerator: orchestration
   - Formatters: format-specific logic
   - Constants: constant management

2. **Open/Closed Principle** ✓
   - Open for extension (add new formatters)
   - Closed for modification (no changes to existing code needed)

3. **Liskov Substitution Principle** ✓
   - All ReportFormatter implementations are substitutable
   - No behavioral surprises

4. **Interface Segregation Principle** ✓
   - ReportFormatter interface is minimal and focused
   - No forced unused methods

5. **Dependency Inversion Principle** ✓
   - ReportGenerator depends on ReportFormatter interface
   - Not on concrete implementations

### Design Pattern Recognition:

1. **Strategy Pattern**: Different formatting strategies encapsulated
2. **Factory Pattern**: Formatters created and stored in map
3. **Template Method Pattern**: Common structure in formatters (header, body, footer)

---

## Testing Strategy

The refactored design is significantly more testable:

### Unit Testing Individual Components:

```java
// Test PDF Formatter in isolation
@Test
public void testPDFFormatter() {
    ReportFormatter formatter = new PDFReportFormatter();
    List<String> data = Arrays.asList("DATA1", "DATA2");
    String result = formatter.format(data);
    assertTrue(result.contains("PDF REPORT"));
    assertTrue(result.contains("DATA1"));
}

// Test CSV Formatter in isolation
@Test
public void testCSVFormatter() {
    ReportFormatter formatter = new CSVReportFormatter();
    List<String> data = Arrays.asList("DATA1", "DATA2");
    String result = formatter.format(data);
    assertTrue(result.contains("ID,Data,Status"));
    assertTrue(result.contains("DATA1"));
}

// Test with mock formatter
@Test
public void testReportGeneratorWithMock() {
    ReportFormatter mockFormatter = mock(ReportFormatter.class);
    when(mockFormatter.format(any())).thenReturn("MOCK REPORT");
    // Inject and test...
}
```

### Integration Testing:

```java
@Test
public void testEndToEndPDFGeneration() {
    List<String> data = Arrays.asList("item1", "item2", "item3");
    ReportGenerator generator = new ReportGenerator("PDF", data);
    String report = generator.generateReport();
    assertNotNull(report);
    assertTrue(report.contains("ITEM1"));
}
```

---

## Extensibility Demonstration

### Adding a New JSON Format:

**Step 1**: Create new formatter class
```java
package refactored.formatters;

public class JSONReportFormatter implements ReportFormatter {
    @Override
    public String format(List<String> processedData) {
        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"reportType\": \"JSON\",\n");
        json.append("  \"records\": [\n");
        for (int i = 0; i < processedData.size(); i++) {
            json.append("    {\"id\": ").append(i + 1).append(", ");
            json.append("\"data\": \"").append(processedData.get(i)).append("\"}");
            if (i < processedData.size() - 1) json.append(",");
            json.append("\n");
        }
        json.append("  ]\n");
        json.append("}\n");
        return json.toString();
    }
    
    @Override
    public String getReportType() {
        return "JSON";
    }
}
```

**Step 2**: Add constant (optional)
```java
// In ReportConstants.java
public static final String REPORT_TYPE_JSON = "JSON";
```

**Step 3**: Register in ReportGenerator
```java
// In initializeFormatters() method
formatters.put(ReportConstants.REPORT_TYPE_JSON, new JSONReportFormatter());
```

**That's it!** No modifications to:
- ReportGenerator core logic
- Existing formatters (PDF, CSV)
- DataProcessor
- Any other class

This demonstrates **Open/Closed Principle** in action.

---

## Lessons Learned

### Key Takeaways:

1. **Small Methods Are Better**
   - Long methods are hard to understand and test
   - Extract Method refactoring improves clarity dramatically

2. **Polymorphism > Conditionals**
   - If/else chains are rigid and hard to extend
   - Polymorphic design is flexible and maintainable

3. **Encapsulation Matters**
   - Public fields break encapsulation
   - Private fields with accessors provide flexibility and control

4. **Constants Prevent Bugs**
   - Magic strings/numbers cause typos and silent failures
   - Named constants provide compile-time checking and maintainability

5. **Dead Code Costs**
   - Unused code adds confusion and maintenance burden
   - Remove it aggressively

6. **Design for Change**
   - Open/Closed Principle makes extensions easy
   - Depend on abstractions, not concretions

### Refactoring Best Practices:

1. **Refactor in Small Steps**
   - Don't try to do everything at once
   - Apply one refactoring at a time
   - Test after each change

2. **Use Automated Testing**
   - Tests provide safety net
   - Refactor with confidence
   - Catch regressions immediately

3. **Follow SOLID Principles**
   - They're not academic theory
   - They lead to practical, maintainable code
   - Each principle solves real problems

4. **Think About Future Changes**
   - What will need to change?
   - Make those changes easy
   - Design for extensibility

---

## Conclusion

This refactoring project successfully transformed a poorly designed codebase into a well-structured, maintainable system. By applying 8 specific refactoring techniques, we:

- **Reduced complexity** (40+ line method → 8 lines)
- **Improved testability** (can test components in isolation)
- **Enhanced extensibility** (add new formats without modifying existing code)
- **Eliminated code smells** (no magic strings, no public fields, no dead code)
- **Achieved SOLID compliance** (all 5 principles followed)

The refactored codebase is:
- ✓ Easier to understand
- ✓ Easier to modify
- ✓ Easier to test
- ✓ Easier to extend
- ✓ More maintainable

This demonstrates the power of systematic refactoring and adherence to software engineering principles. The investment in refactoring pays dividends in long-term maintainability and extensibility.

---

## References

1. Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley.
2. Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.
3. Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
4. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.

---

**End of Report**
