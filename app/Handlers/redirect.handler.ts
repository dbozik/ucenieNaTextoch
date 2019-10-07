import { Navigation } from '../navigation';
import { BaseHandler } from './handler.interface';

export class RedirectHandler<T> extends BaseHandler<T> {

    constructor(
        private redirectUrl: string,
    ) {
        super();
    }

    public run = (payload: T) => {
        (new Navigation()).openPage(this.redirectUrl);

        if (this.next) {
            this.next.run(payload);
        }
    }

}
