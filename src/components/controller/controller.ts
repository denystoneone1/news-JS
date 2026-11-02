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

    public getNews(sourceId: string, callback: Callback<ArticlesResponse>): void {
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
}

export default AppController;
