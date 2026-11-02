import { LOGO_HOST_OVERRIDES } from '../../../config';
import { Source } from '../../../types';
import { getElement } from '../../../utils/dom';

const FAVICON_SERVICE = 'https://www.google.com/s2/favicons';

// Кнопка источника с логотипом. Используется в топе, в поиске и в каталоге
export function createSourceItem(source: Readonly<Source>): HTMLButtonElement {
    const template = getElement<HTMLTemplateElement>(document, '#sourceItemTemp');
    const clone = document.importNode(template.content, true);

    const item = getElement<HTMLButtonElement>(clone, '.source__item');
    item.dataset.sourceId = source.id;
    item.dataset.category = source.category;
    getElement(clone, '.source__item-name').textContent = source.name;

    const logo = getElement<HTMLImageElement>(clone, '.source__logo');
    const logoUrl = getLogoUrl(source.url);

    if (logoUrl) {
        // Если у сайта нет логотипа, сервис отвечает 404: подставляем букву
        logo.addEventListener('error', () => logo.replaceWith(createLetterLogo(source.name)), { once: true });
        logo.src = logoUrl;
    } else {
        logo.replaceWith(createLetterLogo(source.name));
    }

    return item;
}

function getLogoUrl(siteUrl: string): string | null {
    try {
        const { hostname } = new URL(siteUrl);
        const host = hostname in LOGO_HOST_OVERRIDES ? LOGO_HOST_OVERRIDES[hostname] : hostname;
        return host ? `${FAVICON_SERVICE}?domain=${host}&sz=64` : null;
    } catch {
        return null;
    }
}

function createLetterLogo(name: string): HTMLSpanElement {
    const letter = document.createElement('span');
    letter.className = 'source__logo source__logo--letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = name.charAt(0).toUpperCase();
    return letter;
}
