import { Observable } from 'rxjs';
import { BaseHandler } from './handler.interface';

export class SendRequestHandler<T> extends BaseHandler<T> {
    constructor(
        private dbRequest: Observable<any>,
    ) {
        super();
    }

    public run = (payload: T) => {
        this.dbRequest.subscribe((dbResult: T) => {
            if (this.next) {
                this.next.run(dbResult);
            }
        }, (error) => console.dir(error));
    }
}
