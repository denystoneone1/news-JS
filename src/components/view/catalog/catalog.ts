import { Category, CategoryFilter, Source } from '../../../types';
import { getElement } from '../../../utils/dom';
import { createSourceItem } from '../sources/sourceItem';
import './catalog.css';

// Модальное окно со всеми источниками: по алфавиту, с фильтром по категориям
class Catalog {
    private readonly dialog: HTMLDialogElement;

    constructor() {
        this.dialog = getElement<HTMLDialogElement>(document, '.catalog');
    }

    public init(sources: readonly Source[]): void {
        this.drawCategories(sources);
        this.drawGroups(sources);

        getElement(document, '.top-sources__all').addEventListener('click', () => this.open());
        getElement(this.dialog, '.catalog__close').addEventListener('click', () => this.close());

        // Клик по затемненному фону (::backdrop) приходит на сам dialog
        this.dialog.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.dialog) this.close();
        });
    }

    public open(): void {
        this.dialog.showModal();
    }

    public close(): void {
        if (this.dialog.open) this.dialog.close();
    }

    // Группы по первой букве: "A" -> [ABC News, Axios, ...]
    private drawGroups(sources: readonly Source[]): void {
        const groups = new Map<string, Source[]>();
        sources.forEach((source) => {
            const first = source.name.charAt(0).toUpperCase();
            const letter = /[A-Z]/.test(first) ? first : '#';
            groups.set(letter, [...(groups.get(letter) ?? []), source]);
        });

        const fragment = document.createDocumentFragment();
        groups.forEach((items, letter) => {
            const group = document.createElement('section');
            group.className = 'catalog__group';

            const heading = document.createElement('h3');
            heading.className = 'catalog__letter';
            heading.textContent = letter;

            const list = document.createElement('ul');
            list.className = 'catalog__items';
            items.forEach((source) => {
                const listItem = document.createElement('li');
                listItem.append(createSourceItem(source));
                list.append(listItem);
            });

            group.append(heading, list);
            fragment.append(group);
        });

        getElement(this.dialog, '.catalog__list').append(fragment);
    }

    private drawCategories(sources: readonly Source[]): void {
        const counts = new Map<Category, number>();
        sources.forEach(({ category }) => counts.set(category, (counts.get(category) ?? 0) + 1));

        const nav = getElement(this.dialog, '.categories');
        const fragment = document.createDocumentFragment();

        fragment.append(this.createCategoryButton('all', 'All', sources.length));
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

        this.dialog.querySelectorAll<HTMLElement>('.catalog__items .source__item').forEach((item) => {
            const listItem = item.closest('li');
            if (listItem) listItem.hidden = filter !== 'all' && item.dataset.category !== filter;
        });

        // Буква без видимых источников тоже прячется
        this.dialog.querySelectorAll<HTMLElement>('.catalog__group').forEach((group) => {
            group.hidden = !group.querySelector('li:not([hidden])');
        });
    }
}

export default Catalog;
