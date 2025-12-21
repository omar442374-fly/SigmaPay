# Refactored Class Diagram (After Refactoring)

## UML Class Diagram

```
┌─────────────────────────────────────┐
│       ReportConstants               │
│          <<final>>                  │
├─────────────────────────────────────┤
│ + REPORT_TYPE_PDF: String {static}  │
│ + REPORT_TYPE_CSV: String {static}  │
│ + DEFAULT_FOOTER: String {static}   │
│ + ERROR_NO_DATA: String {static}    │
│ + ERROR_UNSUPPORTED_TYPE: String    │
│   {static}                          │
├─────────────────────────────────────┤
│ - ReportConstants()                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       ReportGenerator               │
├─────────────────────────────────────┤
│ - reportType: String                │
│ - rawData: String                   │
├─────────────────────────────────────┤
│ + ReportGenerator(rawData: String,  │
│                   reportType: String)│
│ + generateReport(): String          │
│ + getReportType(): String           │
│ + setReportType(type: String): void │
│ - getRawData(): String              │
│ - setRawData(data: String): void    │
│ - validateData(): boolean           │
│ - processRawData(): String          │
│ - formatReport(data: String): String│
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

┌─────────────────────────────────────┐
│    <<interface>>                    │
│    ReportFormatter                  │
├─────────────────────────────────────┤
│ + format(processedData: String):    │
│   String                            │
│ + getHeader(): String               │
│ + getBody(processedData: String):   │
│   String                            │
│ + getFooter(): String               │
└─────────────────────────────────────┘
                △
                │ implements
       ┌────────┴────────┐
       │                 │
┌──────────────┐  ┌──────────────┐
│PDFReport     │  │CSVReport     │
│Formatter     │  │Formatter     │
├──────────────┤  ├──────────────┤
│              │  │              │
├──────────────┤  ├──────────────┤
│+ format()    │  │+ format()    │
│+ getHeader() │  │+ getHeader() │
│+ getBody()   │  │+ getBody()   │
│+ getFooter() │  │+ getFooter() │
│              │  │- formatCSVData()│
└──────────────┘  └──────────────┘
       △                 △
       └────────┬────────┘
                │ creates
┌─────────────────────────────────────┐
│  ReportFormatterFactory             │
│          <<factory>>                │
├─────────────────────────────────────┤
│                                     │
├─────────────────────────────────────┤
│ + createFormatter(type: String):    │
│   ReportFormatter {static}          │
└─────────────────────────────────────┘
                △
                │ uses
                │
        ReportGenerator
```

## Relationships

1. **Dependency**: 
   - ReportGenerator depends on DataProcessor
   - ReportGenerator depends on ReportFormatterFactory
   - ReportGenerator depends on ReportConstants
   - PDFReportFormatter and CSVReportFormatter depend on ReportConstants

2. **Implementation**: 
   - PDFReportFormatter implements ReportFormatter
   - CSVReportFormatter implements ReportFormatter

3. **Creation**: 
   - ReportFormatterFactory creates ReportFormatter implementations

## Package Structure

```
srt/
├── model/
│   ├── ReportGenerator.java
│   └── ReportConstants.java
├── formatter/
│   ├── ReportFormatter.java (interface)
│   ├── PDFReportFormatter.java
│   ├── CSVReportFormatter.java
│   └── ReportFormatterFactory.java
└── processor/
    └── DataProcessor.java
```

## Design Improvements

1. **Single Responsibility Principle (SRP)**:
   - ReportGenerator: Coordinates report generation
   - ReportFormatter implementations: Handle format-specific logic
   - DataProcessor: Transforms raw data
   - ReportConstants: Stores constants

2. **Open/Closed Principle (OCP)**:
   - Easy to add new report types by creating new ReportFormatter implementations
   - No need to modify existing code

3. **Dependency Inversion Principle (DIP)**:
   - ReportGenerator depends on ReportFormatter interface, not concrete implementations
   - Makes the system more testable and flexible

4. **Better Maintainability**:
   - Smaller, focused methods
   - Clear separation of concerns
   - No magic strings
   - No dead code
   - Proper encapsulation
