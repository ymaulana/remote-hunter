import {
    subMinutes,
    subHours,
    subDays,
    subWeeks,
    subMonths,
    subYears
} from 'date-fns';

export function parseRelativeDate(text: string): Date {
    const now = new Date();
    const match = text.match(/(\d+)\s+(minute|hour|day|week|month)s?\s+ago/i);

    if (!match) return now;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 'minute': return subMinutes(now, value);
        case 'hour': return subHours(now, value);
        case 'day': return subDays(now, value);
        case 'week': return subWeeks(now, value);
        case 'month': return subMonths(now, value);
        case 'year': return subYears(now, value);
        default: return now;
    }
}
