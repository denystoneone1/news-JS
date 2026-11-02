import { Source } from '../../../types';
import { getElement } from '../../../utils/dom';
import { createSourceItem } from '../sources/sourceItem';
import './search.css';

const MAX_RESULTS = 8;

class Search {
    private sources: readonly Source[] = [];
    private readonly root: HTMLElement;
    private readonly input: HTMLInputElement;
    private readonly results: HTMLElement;

    constructor() {
        this.root = getElement(document, '.search');
        this.input = getElement<HTMLInputElement>(this.root, '.search__input');
        this.results = getElement(this.root, '.search__results');
    }

    public init(sources: readonly Source[]): void {
        this.sources = sources;

        this.input.addEventListener('input', () => this.render());
        this.input.addEventListener('keydown', (e: KeyboardEvent) => this.handleInputKey(e));
        this.results.addEventListener('keydown', (e: KeyboardEvent) => this.handleResultsKey(e));

        // Клик мимо поиска закрывает подсказки
        document.addEventListener('click', (e: MouseEvent) => {
            if (e.target instanceof Node && !this.root.contains(e.target)) this.close();
        });
    }

    public reset(): void {
        this.input.value = '';
        this.close();
    }

    private render(): void {
        const query = this.input.value.trim().toLowerCase();
        this.results.innerHTML = '';

        if (!query) {
            this.close();
            return;
        }

        const matches = this.find(query);
        const fragment = document.createDocumentFragment();

        if (matches.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'search__empty';
            empty.textContent = `No sources match "${this.input.value.trim()}"`;
            fragment.append(empty);
        }

        matches.forEach((source) => {
            const listItem = document.createElement('li');
            listItem.append(createSourceItem(source));
            fragment.append(listItem);
        });

        this.results.append(fragment);
        this.open();
    }

    // Сначала источники, название которых начинается с запроса, потом остальные совпадения
    private find(query: string): Source[] {
        const startsWith = (source: Source): number => (source.name.toLowerCase().startsWith(query) ? 0 : 1);

        return this.sources
            .filter((source) => source.name.toLowerCase().includes(query))
            .sort((a, b) => startsWith(a) - startsWith(b))
            .slice(0, MAX_RESULTS);
    }

    private getResultButtons(): HTMLButtonElement[] {
        return [...this.results.querySelectorAll<HTMLButtonElement>('.source__item')];
    }

    private handleInputKey(e: KeyboardEvent): void {
        const [first] = this.getResultButtons();

        if (e.key === 'ArrowDown' && first) {
            e.preventDefault();
            first.focus();
        } else if (e.key === 'Enter' && first) {
            e.preventDefault();
            first.click();
        } else if (e.key === 'Escape') {
            this.reset();
        }
    }

    private handleResultsKey(e: KeyboardEvent): void {
        const buttons = this.getResultButtons();
        const index = buttons.findIndex((button) => button === document.activeElement);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            buttons[Math.min(index + 1, buttons.length - 1)]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index <= 0) this.input.focus();
            else buttons[index - 1]?.focus();
        } else if (e.key === 'Escape') {
            this.close();
            this.input.focus();
        }
    }

    private open(): void {
        this.results.hidden = false;
        this.input.setAttribute('aria-expanded', 'true');
    }

    private close(): void {
        this.results.hidden = true;
        this.input.setAttribute('aria-expanded', 'false');
    }
}

export default Search;
