const articleDateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const todayFormat = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

// "12 Feb 2024, 07:18"
export function formatArticleDate(isoDate: string): string {
    return articleDateFormat.format(new Date(isoDate));
}

// "Monday 2 November 2026"
export function formatToday(date: Date = new Date()): string {
    return todayFormat.format(date).replace(',', '');
}
