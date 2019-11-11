import { Navigation } from '../navigation';
import { BaseHandler } from './base-handler';

export class RedirectHandler<T> extends BaseHandler<T> {

    constructor(
        private redirectUrl: string[],
    ) {
        super();
    }

    public run = (payload: T) => {
        (new Navigation()).openPage(this.redirectUrl);

        if (this._next) {
            this._next.run(payload);
        }
    }

}
