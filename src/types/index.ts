// Статус ответа: может быть только одна из двух строк (union type)
export type ResponseStatus = 'ok' | 'error';

// Категории источников News API (union type)
export type Category = 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';

// Фильтр во вкладках: конкретная категория или все сразу
export type CategoryFilter = Category | 'all';

// Один источник: элемент массива "sources"
export interface Source {
    id: string;
    name: string;
    description: string;
    url: string;
    category: Category;
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

// Эндпоинты API (enum)
export enum Endpoint {
    Sources = 'sources',
    Everything = 'everything',
}

// HTTP-статусы, на которые реагирует errorHandler (enum)
export enum HttpStatus {
    Unauthorized = 401,
    NotFound = 404,
}

// HTTP-метод запроса (union type)
export type HttpMethod = 'GET' | 'POST';

// Query-параметры запроса
export interface QueryOptions {
    apiKey: string;
    sources: string;
}

// Параметры для getResp
export interface RequestParams {
    endpoint: Endpoint;
    options?: Partial<QueryOptions>;
}

// Тип функции-колбэка (generic + function type)
export type Callback<T> = (data: T) => void;
