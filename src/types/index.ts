// Статус ответа: может быть только одна из двух строк (union type)
export type ResponseStatus = 'ok' | 'error';

// Один источник: элемент массива "sources"
export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

// Весь ответ /sources
export interface SourcesResponse {
    status: ResponseStatus;
    sources: Source[];
}

// Одна статья: элемент массива "articles"
export interface Article {
    // Из Source берем name (utility type Pick), id добавляем свой: у статьи он может быть null
    source: Pick<Source, 'name'> & { id: string | null };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

// Весь ответ /everything
export interface ArticlesResponse {
    status: ResponseStatus;
    totalResults: number;
    articles: Article[];
}
