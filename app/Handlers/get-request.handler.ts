import { ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { BaseHandler } from './base-handler';

export class GetRequestHandler<T = any> extends BaseHandler<T> {
    constructor(
        private eventName: string,
        private dbRequest: (arg: any) => Observable<any>,
    ) {
        super();
    }


    public run = (payload: T) => {
        ipcMain.on(this.eventName, (event, data: any) => {
            this.dbRequest(data).subscribe((response) => {
                event.sender.send(this.eventName + '-reply', response);

                if (this._next) {
                    this._next.run(response);
                }
            });
        });
    }
}
