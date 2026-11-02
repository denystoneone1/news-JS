import { DEFAULT_SOURCE_ID } from '../../config';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;
    private currentSourceId: string | null = null;
    private lastRequestId = 0;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        this.view.drawDate();

        // Источники есть в трех местах (топ, поиск, каталог): ловим клики по всем сразу
        document.addEventListener('click', (e: MouseEvent) => this.handleClick(e));

        this.controller.getSources((data) => {
            this.view.drawSources(data);

            const defaultSource = this.view.getDefaultSource(DEFAULT_SOURCE_ID);
            if (defaultSource) this.selectSource(defaultSource.id);
        });
    }

    private handleClick(e: MouseEvent): void {
        if (!(e.target instanceof Element)) return;

        const item = e.target.closest<HTMLElement>('[data-source-id]');
        const sourceId = item?.dataset.sourceId;
        if (sourceId) this.selectSource(sourceId);
    }

    private selectSource(sourceId: string): void {
        this.view.closeSourcePickers();
        if (sourceId === this.currentSourceId) return;

        const source = this.view.findSource(sourceId);
        if (!source) return;

        this.currentSourceId = sourceId;
        this.view.selectSource(source);

        // Если быстро выбрать два источника подряд, ответ на первый запрос может прийти позже.
        // Номер запроса не дает старому ответу перерисовать новости
        const requestId = ++this.lastRequestId;
        this.controller.getNews(sourceId, (data) => {
            if (requestId === this.lastRequestId) this.view.drawNews(data);
        });
    }
}

export default App;
