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

// Сайты из News API, которые переехали или закрылись: у старого домена нет иконки (404 в консоли).
// Строка - новый домен для логотипа, null - логотипа нет, сразу показываем букву
export const LOGO_HOST_OVERRIDES: Readonly<Record<string, string | null>> = {
    'news.vice.com': 'www.vice.com',
    'www.recode.net': null,
};
