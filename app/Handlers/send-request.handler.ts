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
            if (this._next) {
                this._next.run(dbResult);
            }
        }, (error) => {
            console.dir(error);
            if (this._error) {
                this._error.run(error);
            }
        });
    }
}
