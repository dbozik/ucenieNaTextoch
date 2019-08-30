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

        this._ipc.on(event + '-reply', (e, args) => {
            result.next(args);
            result.complete();
        });

        this._ipc.send(event);
        return result.asObservable();
    }
}
