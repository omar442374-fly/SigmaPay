package srt.processor;

/**
 * Data processor for transforming raw data.
 * This class remains relatively unchanged as it already follows good design principles.
 */
public class DataProcessor {
    
    /**
     * Processes raw data by applying transformations.
     * 
     * @param data The raw data to process
     * @return The processed data
     */
    public static String processData(String data) {
        // Simulates complex, independent data transformation logic
        return data.replaceAll(" ", "_").toLowerCase();
    }
}
