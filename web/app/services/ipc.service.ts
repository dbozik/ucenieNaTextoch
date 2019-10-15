import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import { ipcEvents } from '../../shared/ipc-events.enum';

@Injectable({
    providedIn: 'root',
})
export class IpcService {
    constructor() {
        if ((window as any).require) {
            try {
                this._ipc = (window as any).require('electron').ipcRenderer;
            } catch (error) {
                throw error;
            }
        } else {
            console.warn('Could not load electron ipc');
        }
    }

    private _ipc: IpcRenderer;

    public get ipc(): IpcRenderer {
        return this._ipc;
    }


    public getData<T>(event: ipcEvents): Observable<T> {
        const result: Subject<T> = new Subject();
        const replyEvent: string = event + '-reply';

        this._ipc.on(replyEvent, (e, args) => {
            result.next(args);
            result.complete();

            this._ipc.removeAllListeners(replyEvent);
        });

        this._ipc.send(event);
        return result.asObservable();
    }


    public sendData<T, S = T>(event: ipcEvents, data: T): Observable<S> {
        const result: Subject<S> = new Subject();
        const replyEvent: string = event + '-reply';

        this._ipc.on(replyEvent, (e, args) => {
            result.next(args);
            result.complete();

            this._ipc.removeAllListeners(replyEvent);
        });

        this._ipc.send(event, data);
        return result.asObservable();
    }
}
