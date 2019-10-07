import { ipcMain } from 'electron';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { BaseHandler } from './base-handler';

export class IpcMainHandler<T> extends BaseHandler<T> {
    public run: (payload: T) => void = (payload => {
        ipcMain.on(this.eventName, (event, data: any) => {
            if (this.next) {
                this.next.run(data);
            }
        });
    });

    constructor(private eventName: ipcEvents) {
        super();
    }
}
