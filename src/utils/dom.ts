// Находит элемент внутри parent или бросает понятную ошибку, если его нет.
// T - ожидаемый тип элемента (generic с ограничением extends Element).
export function getElement<T extends Element = HTMLElement>(parent: ParentNode, selector: string): T {
    const element = parent.querySelector<T>(selector);
    if (!element) throw new Error(`Element "${selector}" not found`);
    return element;
}
