package initial;

import java.util.ArrayList;
import java.util.List;

/**
 * Helper class for processing raw data.
 * This class is relatively clean and will be reused in the refactored version.
 */
public class DataProcessor {
    
    /**
     * Processes raw data by trimming whitespace and converting to uppercase.
     * 
     * @param rawData List of raw data strings
     * @return List of processed data strings
     */
    public List<String> processData(List<String> rawData) {
        List<String> processed = new ArrayList<>();
        
        if (rawData == null) {
            return processed;
        }
        
        for (String data : rawData) {
            if (data != null && !data.trim().isEmpty()) {
                // Process: trim and convert to uppercase
                String processedItem = data.trim().toUpperCase();
                processed.add(processedItem);
            }
        }
        
        return processed;
    }
    
    /**
     * Validates if the data list is valid for processing.
     * 
     * @param data List to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidData(List<String> data) {
        return data != null && !data.isEmpty();
    }
}
