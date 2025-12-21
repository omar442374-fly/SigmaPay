# Initial Class Diagram

This diagram represents the initial code structure before refactoring.

## UML Class Diagram

```
┌─────────────────────────────────────┐
│      ReportGenerator                │
├─────────────────────────────────────┤
│ + reportType: String                │
│ + rawData: List<String>             │
│ - dataProcessor: DataProcessor      │
├─────────────────────────────────────┤
│ + ReportGenerator(String, List)     │
│ + generateReport(): String          │
│ + printStatus(): void               │
└─────────────────────────────────────┘
                 │
                 │ uses
                 ▼
┌─────────────────────────────────────┐
│      DataProcessor                  │
├─────────────────────────────────────┤
│                                     │
├─────────────────────────────────────┤
│ + processData(List): List<String>   │
│ + isValidData(List): boolean        │
└─────────────────────────────────────┘
```

## Issues with Initial Design

### Code Smells Identified:

1. **Long Method**: `generateReport()` method does too many things
   - Validation
   - Data processing
   - Report formatting (with complex if/else logic)
   - All in one 40+ line method

2. **Conditional Complexity**: If/else chain for report types
   - Violates Open/Closed Principle
   - Hard to add new report formats
   - Duplicated formatting logic

3. **Poor Encapsulation**: Public fields
   - `reportType` is public (should be private)
   - `rawData` is public (should be private)
   - Violates encapsulation principle

4. **Magic Strings**: Hardcoded values
   - "PDF" and "CSV" strings scattered in code
   - Error messages hardcoded
   - Makes maintenance difficult

5. **Unused Code**: Dead code
   - `printStatus()` method is never used
   - Clutters the codebase

6. **God Class**: Single class has multiple responsibilities
   - Report generation
   - Data processing coordination
   - Format-specific rendering logic
   - Violates Single Responsibility Principle

## Relationships

- **ReportGenerator** has a dependency on **DataProcessor**
- All logic is tightly coupled within ReportGenerator
- No abstraction for different report formats
- Difficult to test individual formatting logic

## Metrics

- **Classes**: 2
- **Interfaces**: 0
- **Public Fields**: 2 (bad practice)
- **Lines in generateReport()**: ~40 lines (too long)
- **Cyclomatic Complexity**: High (multiple if/else branches)
