# Initial Class Diagram (Before Refactoring)

## UML Class Diagram

```
┌─────────────────────────────────────┐
│       ReportGenerator               │
├─────────────────────────────────────┤
│ - reportType: String                │
│ - rawData: String                   │
│ + DEFAULT_FOOTER: String {static}   │
├─────────────────────────────────────┤
│ + ReportGenerator(rawData: String,  │
│                   reportType: String)│
│ + generateReport(): String          │
│ + printStatus(): void               │
└─────────────────────────────────────┘
                │
                │ uses
                ▼
┌─────────────────────────────────────┐
│         DataProcessor               │
├─────────────────────────────────────┤
│                                     │
├─────────────────────────────────────┤
│ + processData(data: String): String │
│   {static}                          │
└─────────────────────────────────────┘
```

## Relationships
- **Dependency**: ReportGenerator depends on DataProcessor (uses it to process data)

## Design Problems in Initial Code

1. **Long Method**: The `generateReport()` method is too long and does too many things
   - Validates data
   - Processes data
   - Formats data based on type
   - Handles errors

2. **Conditional Complexity**: Large if/else structure for different report types
   - Violates Open/Closed Principle
   - Hard to add new report types
   - Tightly coupled formatting logic

3. **Large Class**: ReportGenerator has too many responsibilities
   - Data validation
   - Data processing coordination
   - Format-specific formatting logic
   - Error handling

4. **Magic Strings**: Hardcoded strings like "PDF", "CSV", "--- End of Report ---"
   - Hard to maintain
   - Error-prone

5. **Dead Code**: The `printStatus()` method is unused

6. **Poor Encapsulation**: 
   - Fields are accessible but not properly encapsulated
   - Direct field access instead of getters/setters

7. **Low Testability**: Hard to test individual formatting logic separately
