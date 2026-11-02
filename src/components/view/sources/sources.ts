import { TOP_SOURCE_IDS } from '../../../config';
import { Source } from '../../../types';
import { getElement } from '../../../utils/dom';
import { createSourceItem } from './sourceItem';
import './sources.css';

class Sources {
    private list: Source[] = [];

    // Сохраняет список по алфавиту и рисует строку популярных источников в шапке
    public draw(data: Readonly<Source[]>): void {
        this.list = [...data].sort((a, b) => a.name.localeCompare(b.name));

        const fragment = document.createDocumentFragment();
        TOP_SOURCE_IDS.forEach((id) => {
            const source = this.find(id);
            if (!source) return;

            const listItem = document.createElement('li');
            listItem.append(createSourceItem(source));
            fragment.append(listItem);
        });

        getElement(document, '.top-sources__list').append(fragment);
        getElement(document, '.top-sources__count').textContent = String(this.list.length);
    }

    public getAll(): readonly Source[] {
        return this.list;
    }

    public find(id: string): Source | undefined {
        return this.list.find((source) => source.id === id);
    }

    // Подсвечивает источник везде, где он есть: в топе и в каталоге
    public markActive(id: string): void {
        document.querySelectorAll<HTMLElement>('.source__item').forEach((item) => {
            const isActive = item.dataset.sourceId === id;
            item.classList.toggle('source__item--active', isActive);
            if (isActive) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
        });
    }
}

export default Sources;
