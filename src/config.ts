// Популярные источники для строки в шапке. Все проверены: News API отдает по ним новости
export const TOP_SOURCE_IDS = [
    'bbc-news',
    'cnn',
    'al-jazeera-english',
    'nbc-news',
    'fox-news',
    'bloomberg',
    'business-insider',
    'the-verge',
    'techcrunch',
    'wired',
] as const;

// Тип из значений массива: 'bbc-news' | 'cnn' | ...
export type TopSourceId = (typeof TOP_SOURCE_IDS)[number];

// Источник, который открывается при загрузке страницы
export const DEFAULT_SOURCE_ID: TopSourceId = 'bbc-news';
