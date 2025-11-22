import { IntentType, ParsedIntent } from '../intentParser';

export function parseIntentZH(text: string): ParsedIntent {
    const lowerText = text.toLowerCase();

    // Confirmation (Yes/Order)
    if (['好的', '是的', '确认', '下单', '买', '要'].some(w => lowerText.includes(w)) && lowerText.length < 10) {
        return { type: 'CONFIRM' };
    }

    // Search/Buy (Buy X, Find X)
    const searchKeywords = ['买', '要', '来一杯', '想喝', '找', '搜索'];
    if (searchKeywords.some(w => lowerText.includes(w))) {
        let cleanText = lowerText;
        searchKeywords.forEach(k => {
            cleanText = cleanText.replace(k, '');
        });

        // Remove fillers
        cleanText = cleanText.replace(/[一杯点个些]/g, '').trim();

        if (cleanText.length > 0) {
            return { type: 'SEARCH', payload: cleanText };
        }
    }

    return { type: 'UNKNOWN' };
}
