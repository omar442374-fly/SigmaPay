package refactored;

/**
 * Data processing utility class.
 * This class maintains its original responsibility of data transformation.
 * No refactoring was needed as it already follows SRP.
 */
public class DataProcessor {
    public static String processData(String data) {
        // Simulates complex, independent data transformation logic
        return data.replaceAll(" ", "_").toLowerCase();
    }
}