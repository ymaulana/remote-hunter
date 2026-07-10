import { describe, it, expect } from 'vitest';
import { detectCurrency, isValidCurrency, extractCurrencyCode } from '../currency-utils';

describe('isValidCurrency', () => {
    it('should validate common currency codes', () => {
        expect(isValidCurrency('USD')).toBe(true);
        expect(isValidCurrency('EUR')).toBe(true);
        expect(isValidCurrency('GBP')).toBe(true);
        expect(isValidCurrency('CAD')).toBe(true);
        expect(isValidCurrency('AUD')).toBe(true);
        expect(isValidCurrency('JPY')).toBe(true);
    });

    it('should validate regional currency codes', () => {
        expect(isValidCurrency('IDR')).toBe(true); // Indonesian Rupiah
        expect(isValidCurrency('MYR')).toBe(true); // Malaysian Ringgit
        expect(isValidCurrency('VND')).toBe(true); // Vietnamese Dong
        expect(isValidCurrency('THB')).toBe(true); // Thai Baht
        expect(isValidCurrency('PHP')).toBe(true); // Philippine Peso
        expect(isValidCurrency('SGD')).toBe(true); // Singapore Dollar
        expect(isValidCurrency('INR')).toBe(true); // Indian Rupee
    });

    it('should reject invalid currency codes', () => {
        expect(isValidCurrency('XYZ')).toBe(false);
        expect(isValidCurrency('ABC')).toBe(false);
        expect(isValidCurrency('')).toBe(false);
        expect(isValidCurrency('US')).toBe(false);
        expect(isValidCurrency('USDD')).toBe(false);
    });
});

describe('extractCurrencyCode', () => {
    it('should extract valid currency codes from text', () => {
        expect(extractCurrencyCode('100k CAD')).toBe('CAD');
        expect(extractCurrencyCode('Salary: $150,000 USD')).toBe('USD');
        expect(extractCurrencyCode('€60,000 EUR per year')).toBe('EUR');
    });

    it('should return null for text without valid currency codes', () => {
        expect(extractCurrencyCode('100k a year')).toBe(null);
        expect(extractCurrencyCode('')).toBe(null);
        expect(extractCurrencyCode('XYZ ABC')).toBe(null);
    });

    it('should find first valid currency code', () => {
        expect(extractCurrencyCode('Paid in CAD or USD')).toBe('CAD');
    });

    it('should ignore common false positives', () => {
        expect(extractCurrencyCode('Posted 2 days ago')).toBe(null);
        expect(extractCurrencyCode('30 day contract')).toBe(null);
        expect(extractCurrencyCode('The job is PER day')).toBe(null);
        expect(isValidCurrency('AGO')).toBe(false);
        expect(isValidCurrency('DAY')).toBe(false);
    });
});

describe('detectCurrency', () => {
    it('should detect USD from dollar sign', () => {
        expect(detectCurrency('$100k a year', '')).toBe('USD');
    });

    it('should detect GBP from pound symbol', () => {
        expect(detectCurrency('£50,000', '')).toBe('GBP');
        expect(detectCurrency('£40k - £60k', '')).toBe('GBP');
    });

    it('should detect EUR from euro symbol', () => {
        expect(detectCurrency('€60k', '')).toBe('EUR');
        expect(detectCurrency('€50,000 - €70,000', '')).toBe('EUR');
    });

    it('should detect JPY from yen symbol', () => {
        expect(detectCurrency('¥5,000,000', '')).toBe('JPY');
    });

    it('should detect INR from rupee symbol', () => {
        expect(detectCurrency('₹1,500,000', '')).toBe('INR');
    });

    it('should detect IDR from Rp symbol', () => {
        expect(detectCurrency('Rp 15,000,000', '')).toBe('IDR');
    });

    it('should detect MYR from RM symbol', () => {
        expect(detectCurrency('RM 10,000', '')).toBe('MYR');
    });

    it('should detect CAD from currency code in salary', () => {
        expect(detectCurrency('100k CAD', '')).toBe('CAD');
        expect(detectCurrency('$100,000 CAD', '')).toBe('CAD');
    });

    it('should detect currency from description when salary has dollar sign', () => {
        const description = 'Salary range: $204,658 - $236,834 CAD + equity + benefits';
        expect(detectCurrency('$200k', description)).toBe('CAD');
    });

    it('should detect currency from extensions array', () => {
        const extensions = ['Full-time', '100K CAD', 'Remote'];
        expect(detectCurrency(null, '', extensions)).toBe('CAD');
    });

    it('should default to USD when no currency is found', () => {
        expect(detectCurrency(null, '')).toBe('USD');
        expect(detectCurrency('100k a year', '')).toBe('USD');
    });

    it('should handle salary ranges', () => {
        expect(detectCurrency('212K–258K a year', '')).toBe('USD');
        expect(detectCurrency('£80,000 - £100,000', '')).toBe('GBP');
    });

    it('should detect AUD from currency code', () => {
        expect(detectCurrency('$120k AUD', '')).toBe('AUD');
    });

    it('should detect regional currencies from codes', () => {
        expect(detectCurrency('50M IDR', '')).toBe('IDR');
        expect(detectCurrency('15k MYR', '')).toBe('MYR');
        expect(detectCurrency('30M VND', '')).toBe('VND');
    });

    it('should prioritize salary string over description', () => {
        const description = 'Salary in USD';
        expect(detectCurrency('£50,000', description)).toBe('GBP');
    });
});
