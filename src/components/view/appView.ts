import { ArticlesResponse, Source, SourcesResponse } from '../../types';
import { formatToday } from '../../utils/date';
import { getElement } from '../../utils/dom';
import Catalog from './catalog/catalog';
import News from './news/news';
import Search from './search/search';
import Sources from './sources/sources';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;
    private readonly search: Search;
    private readonly catalog: Catalog;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
        this.search = new Search();
        this.catalog = new Catalog();
    }

    public drawDate(): void {
        getElement(document, '.masthead__date').textContent = formatToday();
    }

    public drawNews(data: Partial<ArticlesResponse>): void {
        const values = data.articles ?? [];
        this.news.draw(values);
    }

    public drawSources(data: Partial<SourcesResponse>): void {
        const values = data.sources ?? [];
        this.sources.draw(values);

        const all = this.sources.getAll();
        this.search.init(all);
        this.catalog.init(all);
    }

    public findSource(id: string): Source | undefined {
        return this.sources.find(id);
    }

    // Источник по умолчанию, а если его нет в списке, то первый по алфавиту
    public getDefaultSource(id: string): Source | undefined {
        return this.sources.find(id) ?? this.sources.getAll()[0];
    }

    public closeSourcePickers(): void {
        this.search.reset();
        this.catalog.close();
    }

    // Подсвечивает выбранный источник, показывает его название и описание, включает загрузку
    public selectSource(source: Readonly<Source>): void {
        this.sources.markActive(source.id);
        document.body.dataset.category = source.category;

        getElement(document, '.section-head__title').textContent = source.name;
        getElement(document, '.section-head__text').textContent = source.description;
        getElement(document, '.section-head').hidden = false;

        this.news.showLoading(source.name);
    }
}

export default AppView;
