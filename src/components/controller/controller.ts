import AppLoader from './appLoader';
import { ArticlesResponse, Callback, Endpoint, SourcesResponse } from '../../types';

class AppController extends AppLoader {
    public getSources(callback: Callback<SourcesResponse>): void {
        super.getResp<SourcesResponse>(
            {
                endpoint: Endpoint.Sources,
            },
            callback
        );
    }

    public getNews(e: MouseEvent, callback: Callback<ArticlesResponse>): void {
        const newsContainer = e.currentTarget;
        if (!(newsContainer instanceof HTMLElement)) return;

        let target = e.target;

        while (target instanceof HTMLElement && target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp<ArticlesResponse>(
                        {
                            endpoint: Endpoint.Everything,
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentElement;
        }
    }
}

export default AppController;
