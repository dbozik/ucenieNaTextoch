import { Observable } from 'rxjs';
import { BaseHandler } from './base-handler';

export class SendRequestHandler<T> extends BaseHandler<T> {
    constructor(
        private dbRequest: (arg: any) => Observable<any>,
    ) {
        super();
    }

    public run = (payload: T) => {
        this.dbRequest(payload).subscribe((dbResult: T) => {
            if (this.next) {
                this.next.run(dbResult);
            }
        }, (error) => console.dir(error));
    }
}
