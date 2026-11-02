import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        const sources = document.querySelector<HTMLElement>('.sources');
        if (!sources) throw new Error('Element .sources not found');

        this.view.drawDate();

        sources.addEventListener('click', (e: MouseEvent) => {
            const item = e.target instanceof Element ? e.target.closest<HTMLElement>('.source__item') : null;
            if (item && !item.classList.contains('source__item--active')) this.view.selectSource(item);

            this.controller.getNews(e, (data) => this.view.drawNews(data));
        });
        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
