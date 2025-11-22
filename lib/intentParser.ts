export type IntentType = 'SEARCH' | 'CONFIRM' | 'UNKNOWN';

export interface ParsedIntent {
    type: IntentType;
    payload?: string;
}

export function parseIntent(text: string): ParsedIntent {
    const lowerText = text.toLowerCase();

    // Check for confirmation
    if (['yes', 'sure', 'okay', 'confirm', 'do it', 'please'].some(w => lowerText.includes(w)) && lowerText.length < 20) {
        return { type: 'CONFIRM' };
    }

    // Check for search/buy
    const searchKeywords = ['buy', 'order', 'get', 'find', 'want', 'need'];
    if (searchKeywords.some(w => lowerText.includes(w))) {
        // Extract the product name roughly
        // This is a very naive implementation for the prototype
        // It removes the keywords and assumes the rest is the product
        let cleanText = lowerText;
        searchKeywords.forEach(k => {
            cleanText = cleanText.replace(k, '');
        });

        // Remove common filler words
        cleanText = cleanText.replace(/\b(me|a|an|some|the)\b/g, '').trim();

        if (cleanText.length > 0) {
            return { type: 'SEARCH', payload: cleanText };
        }
    }

    return { type: 'UNKNOWN' };
}
