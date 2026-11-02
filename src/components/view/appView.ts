import { ArticlesResponse, SourcesResponse } from '../../types';
import { formatToday } from '../../utils/date';
import { getElement } from '../../utils/dom';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
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
    }

    // Подсвечивает выбранный источник, показывает его название и описание, включает загрузку
    public selectSource(item: HTMLElement): void {
        document.querySelectorAll('.source__item--active').forEach((active) => {
            active.classList.remove('source__item--active');
            active.removeAttribute('aria-current');
        });
        item.classList.add('source__item--active');
        item.setAttribute('aria-current', 'true');

        const name = item.textContent?.trim() ?? '';
        document.body.dataset.category = item.dataset.category ?? 'general';

        getElement(document, '.section-head__title').textContent = name;
        getElement(document, '.section-head__text').textContent = item.dataset.description ?? '';
        getElement(document, '.section-head').hidden = false;

        this.news.showLoading(name);
    }
}

export default AppView;
