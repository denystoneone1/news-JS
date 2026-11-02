import { Category, CategoryFilter, Source } from '../../../types';
import { getElement } from '../../../utils/dom';
import './sources.css';

class Sources {
    public draw(data: Readonly<Source[]>): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = getElement<HTMLTemplateElement>(document, '#sourceItemTemp');

        data.forEach((item) => {
            const sourceClone = document.importNode(sourceItemTemp.content, true);
            const sourceItem = getElement(sourceClone, '.source__item');

            getElement(sourceClone, '.source__item-name').textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);
            sourceItem.dataset.category = item.category;
            sourceItem.dataset.description = item.description;

            fragment.append(sourceClone);
        });

        getElement(document, '.sources').append(fragment);
        this.drawCategories(data);
    }

    private drawCategories(data: Readonly<Source[]>): void {
        const counts = new Map<Category, number>();
        data.forEach(({ category }) => counts.set(category, (counts.get(category) ?? 0) + 1));

        const nav = getElement(document, '.categories');
        const fragment = document.createDocumentFragment();

        fragment.append(this.createCategoryButton('all', 'All sources', data.length));
        [...counts.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([category, count]) => fragment.append(this.createCategoryButton(category, category, count)));

        nav.append(fragment);
        nav.addEventListener('click', (e: MouseEvent) => this.handleCategoryClick(e, nav));
    }

    private createCategoryButton(category: CategoryFilter, label: string, count: number): HTMLButtonElement {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'categories__item';
        button.dataset.category = category;
        button.setAttribute('aria-pressed', String(category === 'all'));
        button.textContent = label.charAt(0).toUpperCase() + label.slice(1);

        const counter = document.createElement('span');
        counter.className = 'categories__count';
        counter.textContent = String(count);
        button.append(counter);

        return button;
    }

    private handleCategoryClick(e: MouseEvent, nav: HTMLElement): void {
        if (!(e.target instanceof Element)) return;
        const button = e.target.closest<HTMLButtonElement>('.categories__item');
        if (!button) return;

        nav.querySelectorAll('.categories__item').forEach((item) => item.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');

        const filter = button.dataset.category ?? 'all';
        document.querySelectorAll<HTMLElement>('.source__item').forEach((item) => {
            item.hidden = filter !== 'all' && item.dataset.category !== filter;
        });
    }
}

export default Sources;
