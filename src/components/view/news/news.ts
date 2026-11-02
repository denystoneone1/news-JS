import { Article } from '../../../types';
import { formatArticleDate } from '../../../utils/date';
import { getElement } from '../../../utils/dom';
import './news.css';

class News {
    public draw(data: Readonly<Article[]>): void {
        const newsContainer = this.getContainer();
        newsContainer.innerHTML = '';
        newsContainer.setAttribute('aria-busy', 'false');

        if (data.length === 0) {
            newsContainer.append(this.createMessage('No recent stories from this source. Try another one.'));
            return;
        }

        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = getElement<HTMLTemplateElement>(document, '#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = document.importNode(newsItemTemp.content, true);

            if (idx % 2) getElement(newsClone, '.news__item').classList.add('alt');

            const photo = getElement(newsClone, '.news__meta-photo');
            if (item.urlToImage) {
                photo.style.backgroundImage = `url("${item.urlToImage}")`;
            } else {
                photo.classList.add('news__meta-photo--empty');
                photo.textContent = item.source.name;
            }

            getElement(newsClone, '.news__meta-author').textContent = this.getAuthor(item);
            getElement(newsClone, '.news__meta-date').textContent = formatArticleDate(item.publishedAt);

            getElement(newsClone, '.news__description-title').textContent = item.title;
            getElement(newsClone, '.news__description-source').textContent = item.source.name;
            getElement(newsClone, '.news__description-content').textContent = item.description;
            getElement<HTMLAnchorElement>(newsClone, '.news__read-more a').href = item.url;

            fragment.append(newsClone);
        });

        newsContainer.appendChild(fragment);
    }

    public showLoading(sourceName: string): void {
        const newsContainer = this.getContainer();
        newsContainer.innerHTML = '';
        newsContainer.setAttribute('aria-busy', 'true');
        newsContainer.append(this.createMessage(`Loading the latest stories from ${sourceName}…`));
    }

    // Некоторые источники (например, BBC) присылают в author ссылку на соцсеть, а не имя
    private getAuthor({ author, source }: Pick<Article, 'author' | 'source'>): string {
        if (!author || author.startsWith('http')) return source.name;
        return author;
    }

    private getContainer(): HTMLElement {
        return getElement(document, '.news');
    }

    private createMessage(text: string): HTMLParagraphElement {
        const message = document.createElement('p');
        message.className = 'news__empty';
        message.textContent = text;
        return message;
    }
}

export default News;
