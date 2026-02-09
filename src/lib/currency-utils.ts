/**
 * Currency detection utilities for job salary parsing
 * Uses Intl.NumberFormat for dynamic ISO currency code validation
 */

// Map of unique currency symbols to ISO currency codes
// Only includes symbols that unambiguously map to one currency
const CURRENCY_SYMBOLS: Record<string, string> = {
    '£': 'GBP',
    '€': 'EUR',
    '¥': 'JPY', // Could also be CNY, but JPY is more common in remote jobs
    '₹': 'INR',
    '₽': 'RUB',
    '₩': 'KRW',
    '₫': 'VND',
    '฿': 'THB',
    '₱': 'PHP',
    'Rp': 'IDR',
    'RM': 'MYR',
    'R$': 'BRL',
    'C$': 'CAD',
    'A$': 'AUD',
    'NZ$': 'NZD',
    'S$': 'SGD',
    'HK$': 'HKD',
};

// Common false positives to ignore even if they might look like codes
const IGNORED_CODES = new Set([
    'AGO', 'DAY', 'AND', 'FOR', 'THE', 'NOT', 'YES', 'BUT', 'CAN', 'ALL', 'ANY', 'NEW', 'NOW', 'JOB', 'ONE', 'TWO', 'SIX', 'TEN'
]);

// Cache supported currencies for performance
const SUPPORTED_CURRENCIES = new Set(
    typeof Intl.supportedValuesOf === 'function'
        ? Intl.supportedValuesOf('currency')
        // Fallback for older environments (though Node 18+ supports it)
        : ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CNY', 'NZD', 'SGD', 'HKD', 'KRW', 'MXN', 'BRL', 'ZAR', 'CHF', 'IDR', 'MYR', 'VND', 'THB', 'PHP']
);

/**
 * Validates if a 3-letter code is a valid ISO 4217 currency code
 * Uses Intl.supportedValuesOf for robust validation against known currencies
 * 
 * @param code - 3-letter currency code to validate
 * @returns true if valid and supported ISO currency code, false otherwise
 */
function isValidCurrency(code: string): boolean {
    if (!code || code.length !== 3) return false;

    const upperCode = code.toUpperCase();
    if (IGNORED_CODES.has(upperCode)) return false;

    return SUPPORTED_CURRENCIES.has(upperCode);
}

/**
 * Extracts all potential 3-letter currency codes from text
 * and returns the first valid one found
 * 
 * @param text - Text to scan for currency codes
 * @returns Valid currency code or null if none found
 */
function extractCurrencyCode(text: string): string | null {
    if (!text) return null;

    // Match any 3-letter uppercase word that could be a currency code
    const pattern = /\b([A-Z]{3})\b/g;
    const matches = text.toUpperCase().matchAll(pattern);

    for (const match of matches) {
        const code = match[1];
        if (isValidCurrency(code)) {
            return code;
        }
    }

    return null;
}

/**
 * Detects the currency from salary string, description, and extensions
 * 
 * @param salary - The salary string from detected_extensions.salary
 * @param description - The job description text
 * @param extensions - Optional array of extension strings
 * @returns ISO currency code (e.g., "USD", "GBP", "EUR")
 */
export function detectCurrency(
    salary: string | null,
    description: string,
    extensions?: string[]
): string {
    // 1. Check salary string for explicit currency symbols
    if (salary) {
        // Check for multi-char symbols first (like C$, A$, Rp, RM)
        for (const [symbol, code] of Object.entries(CURRENCY_SYMBOLS)) {
            if (symbol.length > 1 && salary.includes(symbol)) {
                return code;
            }
        }
        // Then check single-char symbols
        for (const [symbol, code] of Object.entries(CURRENCY_SYMBOLS)) {
            if (symbol.length === 1 && salary.includes(symbol)) {
                return code;
            }
        }

        // Check for currency codes in salary string
        const salaryCode = extractCurrencyCode(salary);
        if (salaryCode) {
            return salaryCode;
        }
    }

    // 2. Check extensions array for currency codes
    if (extensions && extensions.length > 0) {
        for (const ext of extensions) {
            const extCode = extractCurrencyCode(ext);
            if (extCode) {
                return extCode;
            }
        }
    }

    // 3. Check description for salary patterns with currency
    if (description) {
        // Look for patterns like "$150,000 CAD" or "€60,000 EUR"
        const currencyPattern = /[$£€¥₹₽₩₫฿₱]\s*[\d,]+(?:\s*[-–]\s*[$£€¥₹₽₩₫฿₱]?\s*[\d,]+)?\s*([A-Z]{3})/gi;
        const matches = [...description.matchAll(currencyPattern)];

        for (const match of matches) {
            const code = match[1]?.toUpperCase();
            if (code && isValidCurrency(code)) {
                return code;
            }
        }

        // Also check for currency codes near salary-like keywords
        const salaryKeywordPattern = /(?:salary|compensation|pay|range|earning)[^.]*?\b([A-Z]{3})\b/gi;
        const salaryMatches = [...description.matchAll(salaryKeywordPattern)];

        for (const match of salaryMatches) {
            const code = match[1]?.toUpperCase();
            if (code && isValidCurrency(code)) {
                return code;
            }
        }
    }

    // 4. Default to USD if $ symbol is present (most common for remote jobs)
    if (salary && salary.includes('$')) {
        return 'USD';
    }

    // 5. Final fallback
    return 'USD';
}

// Export for testing
export { isValidCurrency, extractCurrencyCode };
